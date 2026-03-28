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

module.exports = {
    readData,
    writeData,
    readContacts,
    writeContacts,
    readCourtesies,
    writeCourtesies
};
