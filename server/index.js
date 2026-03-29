const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const sharp = require('sharp');
const { readData, writeData, readUsers, writeUsers } = require('./data_storage');
const argon2 = require('argon2');
const http = require('http');
const { Server } = require('socket.io');

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nosso_carne_secret_key_2024';

// Configure multer for image uploads (store in memory)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPEG, PNG, WebP e GIF são permitidas'));
        }
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'Acesso negado: Apenas administradores podem acessar esta área.' });
    }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});

// Basic Data Storage Helpers (will be moved to controllers later)
const getMonthData = async (date = new Date()) => {
    return await readData(date);
};

const saveMonthData = async (data, date = new Date()) => {
    return await writeData(data, date);
};

// Routes
// RF1.1: Create Reservation/Item
app.post('/api/items', async (req, res) => {
    try {
        const newItem = {
            status: 'Confirmado',
            ...req.body,
            id: Date.now().toString(), // Ensure ID is generated and not overwritten
            createdAt: new Date().toISOString()
        };

        let date;
        if (newItem.date) {
            const [year, month, day] = newItem.date.split('-').map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date();
        }
        const data = await getMonthData(date);
        data.push(newItem);
        await saveMonthData(data, date);

        // Notify admins
        io.emit('calendarUpdate', { type: 'create', item: newItem });

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// RF1.2: Get Reservations/Items
app.get('/api/items', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const targetDate = (month && year) ? new Date(year, month - 1) : new Date();
        const data = await getMonthData(targetDate);

        // If the month is empty, ensure the file is deleted (cleanup unused JSON)
        if (data.length === 0) {
            await saveMonthData([], targetDate);
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// New Endpoint: Get all items across all months
app.get('/api/items/all', authenticateToken, async (req, res) => {
    try {
        const data = await require('./data_storage').readAllData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

// RF1.3: Update Reservation/Item
app.put('/api/items/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date: itemDate } = req.body; // Use 'date' instead of 'data'
        let date;
        if (itemDate) {
            const [year, month, day] = itemDate.split('-').map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date();
        }
        const data = await getMonthData(date);

        const index = data.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found in this month' });
        }

        data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
        await saveMonthData(data, date);

        // Notify admins
        io.emit('calendarUpdate', { type: 'update', item: data[index] });

        res.json(data[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// RF1.4: Delete Reservation/Item
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date: rawDate } = req.query; // Expecting date in query for context
        let date;
        if (rawDate) {
            const [year, month, day] = rawDate.split('-').map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date();
        }
        const data = await getMonthData(date);

        const filteredData = data.filter(item => item.id !== id);
        if (data.length === filteredData.length) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await saveMonthData(filteredData, date);

        // Notify admins
        io.emit('calendarUpdate', { type: 'delete', id: id });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// RF2: Contacts
app.get('/api/contacts', authenticateToken, async (req, res) => {
    try {
        const data = await require('./data_storage').readContacts();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

app.post('/api/contacts', authenticateToken, async (req, res) => {
    try {
        const data = await require('./data_storage').readContacts();
        const newContact = {
            ...req.body,
            id: Date.now().toString()
        };
        data.push(newContact);
        await require('./data_storage').writeContacts(data);

        // Notify admins
        io.emit('contactsUpdate', { type: 'create', contact: newContact });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.put('/api/contacts', authenticateToken, async (req, res) => {
    try {
        await require('./data_storage').writeContacts(req.body);

        // Notify admins
        io.emit('contactsUpdate', { type: 'update' });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// RF3: Courtesies
app.get('/api/courtesies', async (req, res) => {
    try {
        const data = await require('./data_storage').readCourtesies();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.post('/api/courtesies', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await require('./data_storage').writeCourtesies(req.body);

        // Notify admins
        io.emit('courtesiesUpdate', req.body);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// RF4: Settings
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await require('./data_storage').readSettings();
        // Don't send the password to the client unless authenticated
        const { adminPassword, ...publicSettings } = settings;
        res.json(publicSettings);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.post('/api/settings', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const currentSettings = await require('./data_storage').readSettings();
        const newSettings = { ...currentSettings, ...req.body };
        await require('./data_storage').writeSettings(newSettings);

        // Notify admins
        io.emit('settingsUpdate', newSettings);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// RF5: Colors
app.get('/api/colors', async (req, res) => {
    try {
        const data = await require('./data_storage').readColors();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.post('/api/colors', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await require('./data_storage').writeColors(req.body);

        // Notify admins
        io.emit('colorsUpdate', req.body);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if it's a multi-user login
        if (username) {
            const users = await readUsers();
            const user = users.find(u => u.username === username);

            if (user && await argon2.verify(user.password, password)) {
                const token = jwt.sign({ 
                    username: user.username, 
                    role: user.role 
                }, JWT_SECRET, { expiresIn: '8h' });
                return res.json({ 
                    success: true, 
                    token, 
                    user: { username: user.username, role: user.role } 
                });
            }
        }

        // Fallback or Legacy: Check against settings adminPassword (treat as administrator)
        const settings = await require('./data_storage').readSettings();
        const isMatch = await argon2.verify(settings.adminPassword, password || '');

        if (isMatch) {
            const token = jwt.sign({ 
                username: 'admin', 
                role: 'administrador' 
            }, JWT_SECRET, { expiresIn: '8h' });
            res.json({ 
                success: true, 
                token, 
                user: { username: 'admin', role: 'administrador' } 
            });
        } else {
            res.status(401).json({ error: 'Usuário ou senha incorretos!' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// User Management (Admin Only)
app.get('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const users = await readUsers();
        // Don't send passwords
        const publicUsers = users.map(({ password, ...rest }) => rest);
        res.json(publicUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Preencha todos os campos!' });
        }

        const users = await readUsers();
        if (users.some(u => u.username === username)) {
            return res.status(400).json({ error: 'Usuário já existe!' });
        }

        const hashedPassword = await argon2.hash(password);
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            role, // 'administrador' or 'comum'
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsers(users);

        const { password: _, ...userNoPass } = newUser;
        res.status(201).json(userNoPass);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.delete('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        let users = await readUsers();
        users = users.filter(u => u.id !== id);
        await writeUsers(users);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Change Password
app.post('/api/change-password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { username, role } = req.user;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
        }

        if (username === 'admin') {
            // Legacy/Main Admin Password Change
            const settings = await require('./data_storage').readSettings();
            const isMatch = await argon2.verify(settings.adminPassword, oldPassword);

            if (!isMatch) {
                return res.status(401).json({ error: 'Senha atual incorreta!' });
            }

            const hashedPassword = await argon2.hash(newPassword);
            settings.adminPassword = hashedPassword;
            await require('./data_storage').writeSettings(settings);
        } else {
            // Multi-user Password Change
            const users = await readUsers();
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const isMatch = await argon2.verify(users[userIndex].password, oldPassword);
            if (!isMatch) {
                return res.status(401).json({ error: 'Senha atual incorreta!' });
            }

            users[userIndex].password = await argon2.hash(newPassword);
            await writeUsers(users);
        }

        res.json({ success: true, message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Falha ao alterar a senha' });
    }
});

// Upload Logo Image
app.post('/api/upload-logo', authenticateToken, authorizeAdmin, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const imagesPath = path.join(__dirname, '..', 'public', 'images');
        const bgFilePath = path.join(imagesPath, 'bg.png');

        // Ensure images directory exists
        try {
            await fs.mkdir(imagesPath, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        // Convert image to PNG and save as bg.png (always overwrite)
        await sharp(req.file.buffer)
            .png()
            .toFile(bgFilePath);

        const logoPath = '/images/bg.png';
        res.json({ success: true, logoPath });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Falha ao fazer upload da imagem' });
    }
});

// Serve frontend
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'form.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
