const API_URL = '/api';

// Globais para armazenamento de estado (compartilhadas entre scripts)
let items = [];
let allItems = [];
let contacts = [];
let courtesies = [];
let currentSettings = {};

// --- Auth Helpers ---
function getAuthToken() {
    return localStorage.getItem('admin_token');
}

function setAuthToken(token) {
    if (token) {
        localStorage.setItem('admin_token', token);
    } else {
        localStorage.removeItem('admin_token');
    }
}

function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// --- Funções de API ---
async function loadItemsApi(month, year) {
    try {
        const response = await fetch(`${API_URL}/items?month=${month}&year=${year}`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        if (!response.ok) throw new Error('Failed to fetch items');
        items = await response.json();
    } catch (e) {
        console.error("Erro ao carregar dados da API:", e);
        items = [];
    }
}

async function loadAllItemsApi() {
    try {
        const response = await fetch(`${API_URL}/items/all`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return [];
        }
        if (!response.ok) throw new Error('Failed to fetch items');
        return await response.json();
    } catch (e) {
        console.error("Erro ao carregar todos os dados da API:", e);
        return [];
    }
}

async function loadContactsApi() {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        if (!response.ok) throw new Error('Failed to fetch contacts');
        contacts = await response.json();
    } catch (e) {
        console.error("Erro ao carregar contatos da API:", e);
        contacts = [];
    }
}

async function loadCourtesiesApi() {
    try {
        const response = await fetch(`${API_URL}/courtesies`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
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
            headers: getAuthHeaders(),
            body: JSON.stringify(item)
        });

        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('Failed to save item');

        const savedItem = await response.json();

        // Refresh allItems for tabs
        allItems = await loadAllItemsApi();

        // Update current viewed items if appropriate
        if (item.id) {
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) items[index] = savedItem;
        } else {
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
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }

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
            headers: getAuthHeaders(),
            body: JSON.stringify(contact)
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
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
            headers: getAuthHeaders(),
            body: JSON.stringify(courtesies)
        });
    } catch (e) {
        console.error(e);
    }
}

// Rename to avoid confusion but keep the signature for script.js
function saveItems() {
    saveCourtesiesApi();
    saveContactsApiSync();
}

async function saveContactsApiSync() {
    try {
        await fetch(`${API_URL}/contacts`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(contacts)
        });
    } catch (e) {
        console.error(e);
    }
}

function handleAuthError() {
    localStorage.removeItem('admin_token');
    window.location.reload(); // Redirects to login overlay
}

// Bridge for script.js
window.loadItems = async (month, year) => {
    await loadItemsApi(month, year);
    allItems = await loadAllItemsApi();
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
window.logout = () => {
    setAuthToken(null);
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    window.location.reload();
};
window.saveContactApi = saveContactApi;
window.saveItems = saveItems;
window.loadUsersApi = loadUsersApi;
window.saveUserApi = saveUserApi;
window.deleteUserApi = deleteUserApi;

async function loadUsersApi() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return [];
        }
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (e) {
        console.error("Erro ao carregar usuários da API:", e);
        return [];
    }
}

async function saveUserApi(user) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(user)
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return { success: false, error: 'Não autorizado' };
        }
        if (response.ok) {
            return { success: true, data: await response.json() };
        } else {
            const data = await response.json();
            return { success: false, error: data.error };
        }
    } catch (e) {
        console.error("Erro ao salvar usuário via API:", e);
        return { success: false, error: 'Erro de rede' };
    }
}

async function deleteUserApi(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return false;
        }
        return response.ok;
    } catch (e) {
        console.error("Erro ao deletar usuário via API:", e);
        return false;
    }
}

async function loadSettingsApi() {
    try {
        const response = await fetch(`${API_URL}/settings`); // Keep public for form
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
            headers: getAuthHeaders(),
            body: JSON.stringify(settings)
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        if (!response.ok) throw new Error('Failed to save settings');
        return await response.json();
    } catch (e) {
        console.error("Erro ao salvar configurações via API:", e);
        throw e;
    }
}

async function loginApi(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            setAuthToken(data.token);
            if (data.user) {
                localStorage.setItem('user_role', data.user.role);
                localStorage.setItem('user_name', data.user.username);
            }
            return true;
        }
        return false;
    } catch (e) {
        console.error("Erro ao fazer login:", e);
        return false;
    }
}

async function changePasswordApi(oldPassword, newPassword) {
    try {
        const response = await fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ oldPassword, newPassword })
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return { success: false, error: 'Não autorizado' };
        }
        if (response.ok) {
            const data = await response.json();
            return { success: true, message: data.message };
        } else {
            const data = await response.json();
            return { success: false, error: data.error };
        }
    } catch (e) {
        console.error("Erro ao alterar senha:", e);
        return { success: false, error: 'Erro ao alterar a senha' };
    }
}

async function loadColorsApi() {
    try {
        const response = await fetch(`${API_URL}/colors`);
        if (!response.ok) throw new Error('Failed to fetch colors');
        return await response.json();
    } catch (e) {
        console.error("Erro ao carregar cores da API:", e);
        return {
            primary: '#007AFF',
            secondary: '#34C759',
            accent: '#FF9500'
        };
    }
}

async function saveColorsApi(colors) {
    try {
        const response = await fetch(`${API_URL}/colors`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(colors)
        });
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        if (!response.ok) throw new Error('Failed to save colors');
        return await response.json();
    } catch (e) {
        console.error("Erro ao salvar cores via API:", e);
        throw e;
    }
}
async function uploadLogoApi(file) {
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
        const response = await fetch(`${API_URL}/upload-logo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return null;
        }
        
        if (!response.ok) throw new Error('Falha ao subir logo');
        return await response.json();
    } catch (e) {
        console.error("Erro ao fazer upload da logo:", e);
        throw e;
    }
}

window.changePasswordApi = changePasswordApi;
window.uploadLogoApi = uploadLogoApi;
window.loadColorsApi = loadColorsApi;
window.saveColorsApi = saveColorsApi;

function checkLocalStorageCapacity() { }
function cleanOldItems() { }
