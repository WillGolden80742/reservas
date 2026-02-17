const LOCAL_STORAGE_MAX_PERCENT = 0.9; // 90% para o alerta de cache
const LOCAL_STORAGE_KEY_ITEMS = 'items';
const LOCAL_STORAGE_KEY_COURTESIES = 'courtesies';
const LOCAL_STORAGE_KEY_CONTACTS = 'contacts';

// --- Funções de LocalStorage ---
function loadItems() {
    try {
        const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY_ITEMS);
        items = storedItems ? JSON.parse(storedItems) : [];
        const storedCourtesies = localStorage.getItem(LOCAL_STORAGE_KEY_COURTESIES);
        courtesies = storedCourtesies ? JSON.parse(storedCourtesies) : ['Bolo Pequeno', 'Champanhe', 'Sobremesa Especial'];
        const storedContacts = localStorage.getItem(LOCAL_STORAGE_KEY_CONTACTS);
        contacts = storedContacts ? JSON.parse(storedContacts) : [];
    } catch (e) {
        console.error("Erro ao carregar dados do LocalStorage:", e);
        items = [];
        courtesies = ['Bolo Pequeno', 'Champanhe', 'Sobremesa Especial'];
        contacts = [];
    }
}

function getLocalStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        total += key.length + (value ? value.length : 0); // Approximate size in bytes
    }
    return total;
}

function checkLocalStorageCapacity() {
    // This is an approximate check. Browsers usually have 5-10MB for localStorage.
    // 5MB = 5 * 1024 * 1024 bytes. Let's use 5MB as a rough estimate for 100%
    const MAX_LOCAL_STORAGE_BYTES = 5 * 1024 * 1024; 
    const currentSize = getLocalStorageSize();
    const usagePercent = currentSize / MAX_LOCAL_STORAGE_BYTES;

    if (usagePercent >= LOCAL_STORAGE_MAX_PERCENT) {
        openModal(DOM.cacheAlertModalOverlay);
    }
}

function saveItems() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY_ITEMS, JSON.stringify(items));
        localStorage.setItem(LOCAL_STORAGE_KEY_COURTESIES, JSON.stringify(courtesies));
        localStorage.setItem(LOCAL_STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
        checkLocalStorageCapacity();
    } catch (e) {
        console.error("Erro ao salvar itens no LocalStorage:", e);
        openModal(DOM.alertModalOverlay, 'Erro de Salvamento', 'Não foi possível salvar os dados. O armazenamento local pode estar cheio.', 'error');
    }
}

// --- Limpeza de Itens Antigos (Cache) ---
function cleanOldItems() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    const oneMonthAgoTime = oneMonthAgo.getTime();

    const initialItemCount = items.length;

    items = items.filter(item => {
        const itemDate = new Date(item.date + 'T00:00:00'); 
        return itemDate.getTime() >= oneMonthAgoTime;
    });

    if (items.length < initialItemCount) {
        saveItems();
        console.log(`Limpeza de cache: ${initialItemCount - items.length} itens antigos removidos.`);
    } else {
        console.log('Limpeza de cache: Nenhum item antigo para remover.');
    }
}
