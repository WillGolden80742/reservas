const API_URL = '/api';

// Globais para armazenamento de estado (compartilhadas entre scripts)
let items = [];
let allItems = [];
let contacts = [];
let courtesies = [];
let currentSettings = {};

// --- Funções de API ---
async function loadItemsApi(month, year) {
    try {
        const response = await fetch(`${API_URL}/items?month=${month}&year=${year}`);
        if (!response.ok) throw new Error('Failed to fetch items');
        items = await response.json();
    } catch (e) {
        console.error("Erro ao carregar dados da API:", e);
        items = [];
    }
}

async function loadAllItemsApi() {
    try {
        const response = await fetch(`${API_URL}/items/all`);
        if (!response.ok) throw new Error('Failed to fetch items');
        return await response.json();
    } catch (e) {
        console.error("Erro ao carregar todos os dados da API:", e);
        return [];
    }
}

async function loadContactsApi() {
    try {
        const response = await fetch(`${API_URL}/contacts`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        contacts = await response.json();
    } catch (e) {
        console.error("Erro ao carregar contatos da API:", e);
        contacts = [];
    }
}

async function loadCourtesiesApi() {
    try {
        const response = await fetch(`${API_URL}/courtesies`);
        if (!response.ok) throw new Error('Failed to fetch courtesies');
        courtesies = await response.json();
    } catch (e) {
        console.error("Erro ao carregar cortesias da API:", e);
        courtesies = ['Bolo Pequeno', 'Champanhe', 'Sobremesa Especial'];
    }
}

async function saveItem(item) {
    try {
        const method = item.id ? 'PUT' : 'POST';
        const url = item.id ? `${API_URL}/items/${item.id}` : `${API_URL}/items`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error('Failed to save item');

        const savedItem = await response.json();

        // Refresh allItems for tabs
        allItems = await loadAllItemsApi();

        // Update current viewed items if appropriate
        if (item.id) {
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) items[index] = savedItem;
            // Otherwise, we don't know if we should add it (depends if user is viewing that month)
        } else {
            // Check if it belongs in the current viewed items (approximate check by comparing month/year)
            // But usually post happens on a specific day in the grid, so it's always relevant
            items.push(savedItem);
        }

        return savedItem;
    } catch (e) {
        console.error("Erro ao salvar item via API:", e);
        throw e;
    }
}

async function deleteItemApi(id, date) {
    try {
        const response = await fetch(`${API_URL}/items/${id}?date=${date}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete item');

        items = items.filter(item => item.id !== id);
        allItems = await loadAllItemsApi();
    } catch (e) {
        console.error("Erro ao deletar item via API:", e);
        throw e;
    }
}

async function saveContactApi(contact) {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        if (!response.ok) throw new Error('Failed');
        const saved = await response.json();
        contacts.push(saved);
        return saved;
    } catch (e) {
        console.error(e);
    }
}

async function saveCourtesiesApi() {
    try {
        await fetch(`${API_URL}/courtesies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courtesies)
        });
    } catch (e) {
        console.error(e);
    }
}

// Rename to avoid confusion but keep the signature for script.js
function saveItems() {
    saveCourtesiesApi();
    saveContactsApiSync(); // We need a sync-ish way if script.js Expects it to be fast, or we make script.js async
}

async function saveContactsApiSync() {
    try {
        await fetch(`${API_URL}/contacts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contacts)
        });
    } catch (e) {
        console.error(e);
    }
}

function loadItemsLegacy() {
    // This is a bridge for script.js
    const now = new Date();
    loadItemsApi(now.getMonth() + 1, now.getFullYear());
    loadContactsApi();
    loadCourtesiesApi();
}

// Rename loadItems to loadItemsApi in this file and export loadItems for script.js
window.loadItems = async (month, year) => {
    await loadItemsApi(month, year);
    allItems = await loadAllItemsApi(); // Populate allItems for tabs
    await loadContactsApi();
    await loadCourtesiesApi();
}

window.loadContactsApi = loadContactsApi;
window.loadCourtesiesApi = loadCourtesiesApi;
window.loadSettingsApi = loadSettingsApi;
window.loadAllItemsApi = loadAllItemsApi;
window.saveItem = saveItem;
window.deleteItemApi = deleteItemApi;
window.saveSettingsApi = saveSettingsApi;
window.loginApi = loginApi;
window.saveContactApi = saveContactApi;
window.saveItems = saveItems;

async function loadSettingsApi() {
    try {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return await response.json();
    } catch (e) {
        console.error("Erro ao carregar configurações da API:", e);
        return null;
    }
}

async function saveSettingsApi(settings) {
    try {
        const response = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return await response.json();
    } catch (e) {
        console.error("Erro ao salvar configurações via API:", e);
        throw e;
    }
}

async function loginApi(password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return response.ok;
    } catch (e) {
        console.error("Erro ao fazer login:", e);
        return false;
    }
}

function checkLocalStorageCapacity() { }
function cleanOldItems() { }
