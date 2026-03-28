const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Get the file path for a specific month/year.
 * @param {Date} date 
 */
function getFilePath(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return path.join(DATA_DIR, `reservas.${month}.${year}.json`);
}

/**
 * Ensure the file exists.
 * @param {string} filePath 
 */
async function ensureFileExists(filePath) {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
    }
}

/**
 * Read all data for a specific date.
 * @param {Date} date 
 */
async function readData(date = new Date()) {
    const filePath = getFilePath(date);
    await ensureFileExists(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

/**
 * Write all data for a specific date.
 * @param {Array} data 
 * @param {Date} date 
 */
async function writeData(data, date = new Date()) {
    const filePath = getFilePath(date);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readContacts() {
    const filePath = path.join(DATA_DIR, 'contacts.json');
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
    }
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function writeContacts(data) {
    const filePath = path.join(DATA_DIR, 'contacts.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readCourtesies() {
    const filePath = path.join(DATA_DIR, 'courtesies.json');
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify(['Bolo Pequeno', 'Champanhe', 'Sobremesa Especial'], null, 2));
    }
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function writeCourtesies(data) {
    const filePath = path.join(DATA_DIR, 'courtesies.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readSettings() {
    const filePath = path.join(DATA_DIR, 'settings.json');
    try {
        await fs.access(filePath);
    } catch {
        const defaultSettings = {
            schedules: {
                days: ['Segunda', 'Terça', 'Quarta', 'Quinta'],
                hours: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
                minPeople: 10
            },
            courtesies: {
                rule: '1kg Grátis (Válido para 10+ pessoas)',
                options: ['Brigadeiro', 'Brigadeiro Maracujá', 'Ninho com Nutella', 'Ninho com Morango', 'Ninho com Abacaxi', 'Mousse de Chocolate', 'Prestígio']
            },
            pix: {
                key: '13791998000131',
                owner: 'LORUSSOPROD',
                city: 'SAO PAULO',
                pricePerKg: 95
            },
            whatsappNumber: '5511967105333',
            adminPassword: 'admin' // Default password
        };
        await fs.writeFile(filePath, JSON.stringify(defaultSettings, null, 2));
    }
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function writeSettings(data) {
    const filePath = path.join(DATA_DIR, 'settings.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    readData,
    writeData,
    readContacts,
    writeContacts,
    readCourtesies,
    writeCourtesies,
    readSettings,
    writeSettings
};
