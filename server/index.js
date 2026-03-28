const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { readData, writeData } = require('./data_storage');
const argon2 = require('argon2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

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
            id: Date.now().toString(),
            status: 'Confirmado',
            ...req.body,
            createdAt: new Date().toISOString()
        };

        const date = new Date(newItem.data || new Date());
        const data = await getMonthData(date);
        data.push(newItem);
        await saveMonthData(data, date);

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// RF1.2: Get Reservations/Items
app.get('/api/items', async (req, res) => {
    try {
        const { month, year } = req.query;
        const targetDate = (month && year) ? new Date(year, month - 1) : new Date();
        const data = await getMonthData(targetDate);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// RF1.3: Update Reservation/Item
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: itemDate } = req.body;
        const date = new Date(itemDate || new Date());
        const data = await getMonthData(date);

        const index = data.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found in this month' });
        }

        data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
        await saveMonthData(data, date);

        res.json(data[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// RF1.4: Delete Reservation/Item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date: rawDate } = req.query; // Expecting date in query for context
        const date = rawDate ? new Date(rawDate) : new Date();
        const data = await getMonthData(date);

        const filteredData = data.filter(item => item.id !== id);
        if (data.length === filteredData.length) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await saveMonthData(filteredData, date);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// RF2: Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await require('./data_storage').readContacts();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const data = await require('./data_storage').readContacts();
        const newContact = { id: Date.now().toString(), ...req.body };
        data.push(newContact);
        await require('./data_storage').writeContacts(data);
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.put('/api/contacts', async (req, res) => {
    try {
        await require('./data_storage').writeContacts(req.body);
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

app.post('/api/courtesies', async (req, res) => {
    try {
        await require('./data_storage').writeCourtesies(req.body);
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

app.post('/api/settings', async (req, res) => {
    try {
        const currentSettings = await require('./data_storage').readSettings();
        const newSettings = { ...currentSettings, ...req.body };
        await require('./data_storage').writeSettings(newSettings);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const { password } = req.body;
        const settings = await require('./data_storage').readSettings();

        const isMatch = await argon2.verify(settings.adminPassword, password);

        if (isMatch) {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Serve frontend
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'formulario_clientes.html'));
});

app.get('/', (req, res) => {
    res.redirect('/form');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
