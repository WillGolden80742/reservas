const DOM = {
    app: document.getElementById('app'),
    calendarView: document.getElementById('calendar-view'),
    upcomingItemsView: document.getElementById('upcoming-items-view'),
    ordersView: document.getElementById('orders-view'),
    contactsView: document.getElementById('contacts-view'), // NEW

    calendarTab: document.getElementById('calendarTab'),
    upcomingItemsTab: document.getElementById('upcomingItemsTab'),
    ordersTab: document.getElementById('ordersTab'),
    contactsTab: document.getElementById('contactsTab'), // NEW

    currentMonthYear: document.getElementById('currentMonthYear'),
    calendarGrid: document.querySelector('.calendar-grid'),
    prevMonthBtn: document.getElementById('prevMonth'),
    nextMonthBtn: document.getElementById('nextMonth'),

    itemModalOverlay: document.getElementById('item-modal-overlay'),
    itemModalTitle: document.getElementById('item-modal-title'),
    modalSelectedDate: document.getElementById('modal-selected-date'),
    closeItemModalBtn: document.getElementById('close-item-modal'),

    itemForm: document.getElementById('item-form'),
    formTitle: document.getElementById('form-title'),
    itemIdInput: document.getElementById('item-id'),
    itemTypeSelect: document.getElementById('item-type'),
    statusSelect: document.getElementById('item-status'),
    // NEW: Contact search in item modal integrated into name input
    contactSearchResults: document.getElementById('contact-search-results'),
    phoneInput: document.getElementById('phone'),
    nameInput: document.getElementById('name'),
    saveContactFromItemButton: document.getElementById('save-contact-from-item'), // NEW
    itemTimeInput: document.getElementById('item-time'),

    reservationSpecificFields: document.getElementById('reservation-specific-fields'),
    qtyPeopleInput: document.getElementById('qty-people'),
    observationsInput: document.getElementById('observations'),
    isBirthdayCheckbox: document.getElementById('is-birthday'),
    courtesyFields: document.getElementById('courtesy-fields'),
    courtesySearchInput: document.getElementById('courtesy-search-input'),
    courtesyOptionsList: document.getElementById('courtesy-options-list'),
    noCourtesiesMessage: document.getElementById('no-courtesies-message'),
    addCourtesyInput: document.getElementById('add-courtesy-input'),
    newCourtesyNameInput: document.getElementById('new-courtesy-name'),
    addCourtesyButton: document.getElementById('add-courtesy-button'),

    orderFields: document.getElementById('order-fields'),
    orderDescriptionInput: document.getElementById('order-description'),

    saveItemButton: document.getElementById('save-item-button'),

    existingItemsContainer: document.getElementById('existing-items'),
    existingItemsTitle: document.getElementById('existing-items-title'),
    itemListContainer: document.getElementById('item-list-container'),
    noItemsMessage: document.getElementById('no-items-message'),

    upcomingListContainer: document.getElementById('upcoming-list-container'),
    noUpcomingItemsMessage: document.getElementById('no-upcoming-items-message'),

    orderListContainer: document.getElementById('order-list-container'),
    noOrdersMessage: document.getElementById('no-orders-message'),

    upcomingSearchInput: document.getElementById('upcoming-search-input'), // NEW
    ordersSearchInput: document.getElementById('orders-search-input'), // NEW

    contactsSearchInput: document.getElementById('contact-search-input'), // NEW
    contactListContainer: document.getElementById('contact-list-container'), // NEW
    noContactsMessage: document.getElementById('no-contacts-message'), // NEW
    addContactButtonMain: document.getElementById('add-contact-button-main'), // NEW

    settingsView: document.getElementById('settings-view'),
    settingsTab: document.getElementById('settingsTab'),
    settingsForm: document.getElementById('settings-form'),
    settingsDaysInput: document.getElementById('settings-days'),
    settingsHoursInput: document.getElementById('settings-hours'),
    settingsMinPeopleInput: document.getElementById('settings-min-people'),
    settingsCourtesyRuleInput: document.getElementById('settings-courtesy-rule'),
    settingsCourtesyOptionsContainer: document.getElementById('settings-courtesy-options'),
    settingsPixKeyInput: document.getElementById('settings-pix-key'),
    settingsPixOwnerInput: document.getElementById('settings-pix-owner'),
    settingsPixCityInput: document.getElementById('settings-pix-city'),
    settingsPricePerKgInput: document.getElementById('settings-price-per-kg'),
    settingsWhatsappInput: document.getElementById('settings-whatsapp'),
    newTagInput: document.getElementById('new-tag-input'),
    addTagButton: document.getElementById('add-tag-button'),
    saveSettingsButton: document.getElementById('save-settings-button'),

    loginOverlay: document.getElementById('login-overlay'),
    loginForm: document.getElementById('login-form'),
    adminPasswordInput: document.getElementById('admin-password'),
    loginError: document.getElementById('login-error'),

    contactFormModalOverlay: document.getElementById('contact-form-modal-overlay'), // NEW
    contactModalTitle: document.getElementById('contact-modal-title'), // NEW
    closeContactModalBtn: document.getElementById('close-contact-modal'), // NEW
    contactForm: document.getElementById('contact-form'), // NEW
    contactIdInput: document.getElementById('contact-id'), // NEW
    contactNameInput: document.getElementById('contact-name'), // NEW
    contactPhoneInput: document.getElementById('contact-phone'), // NEW
    contactNotesInput: document.getElementById('contact-notes'), // NEW
    saveContactButton: document.getElementById('save-contact-button'), // NEW

    alertModalOverlay: document.getElementById('alert-modal-overlay'),
    alertModalTitle: document.getElementById('alert-modal-title'),
    alertModalMessage: document.getElementById('alert-modal-message'),
    closeAlertModalBtn: document.getElementById('close-alert-modal'),

    cacheAlertModalOverlay: document.getElementById('cache-alert-modal-overlay'), // NEW
    closeCacheAlertModalBtn: document.getElementById('close-cache-alert-modal'), // NEW

    printModal: document.getElementById('print-modal'),
};

let currentMonth = new Date();
let selectedDate = null;
let selectedCourtesy = null;
let items = [];
let courtesies = [];
let contacts = []; // NEW: Array para armazenar contatos
let currentSettings = {};

// --- Funções de Utilidade de Data ---
function getFormattedDate(date) {
    if (!date) {
        return null;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDisplayDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

function getMonthName(date) {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

// --- Funções de Utilidade de Pesquisa (Normalized Search) ---
function normalizeString(str) {
    if (!str) return '';
    return str.toString()
        .toLowerCase()
        .normalize('NFD') // Decompose combined characters into base + accent
        .replace(/[\u0300-\u036f]/g, '') // Remove accent characters
        .trim();
}

// --- Máscara de Telefone ---
function maskPhoneNumber(value) {
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Limita a 11 dígitos para DDD + 9 dígitos
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    // Aplica a máscara com base no comprimento do valor
    if (value.length >= 11) { // (DD) 9XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length >= 7) { // (DD) XXXX-XXXX (ou 9XXXX-X, etc.)
        value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length >= 3) { // (DD) XXXX (ou 9XXX, etc.)
        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) { // (D
        value = value.replace(/^(\d*)/, '($1');
    }
    // Se for vazio, retorna vazio.

    return value;
}

DOM.phoneInput.addEventListener('input', (e) => {
    e.target.value = maskPhoneNumber(e.target.value);
});
DOM.contactPhoneInput.addEventListener('input', (e) => { // NEW: For contact form
    e.target.value = maskPhoneNumber(e.target.value);
});


// --- Funções de Modal ---
function openModal(modalOverlay, title = '', message = '', type = 'info') {
    if (modalOverlay === DOM.alertModalOverlay) {
        DOM.alertModalTitle.textContent = title;
        DOM.alertModalMessage.textContent = message;
        DOM.alertModalOverlay.querySelector('.alert-modal-content').className = `modal-content alert-modal-content ${type}`;
        DOM.alertModalOverlay.querySelector('.primary-button').onclick = () => closeModal(DOM.alertModalOverlay);
        DOM.alertModalOverlay.querySelector('.primary-button').textContent = 'OK';
    }
    modalOverlay.classList.add('visible');
}

function closeModal(modalOverlay) {
    modalOverlay.classList.remove('visible');
}

// --- Funções de Calendário ---
function renderCalendar() {
    DOM.calendarGrid.querySelectorAll('.calendar-day:not(.calendar-day-header)').forEach(day => day.remove());
    DOM.currentMonthYear.textContent = getMonthName(currentMonth);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = getFormattedDate(today);
    const selectedDateFormatted = selectedDate ? getFormattedDate(selectedDate) : null;

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'inactive');
        DOM.calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        const formattedDate = getFormattedDate(date);

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.dataset.date = formattedDate;
        dayDiv.textContent = day;

        if (formattedDate === todayFormatted) {
            dayDiv.classList.add('current-day');
        }
        if (selectedDateFormatted && formattedDate === selectedDateFormatted) {
            dayDiv.classList.add('selected-day');
        }

        const itemsForDay = items.filter(r => r.date === formattedDate)
            .sort((a, b) => a.time.localeCompare(b.time));

        const reservationsForDay = itemsForDay.filter(item => item.type === 'reservation');
        const ordersForDay = itemsForDay.filter(item => item.type === 'order');

        if (reservationsForDay.length > 0) {
            dayDiv.classList.add('has-reservation');
            const reservationIndicator = document.createElement('div');
            reservationIndicator.classList.add('reservation-indicator');
            // Show orange for pending, green for others
            if (reservationsForDay.some(r => r.status === 'Pendente')) {
                reservationIndicator.classList.add('pending-indicator');
            }
            reservationIndicator.textContent = reservationsForDay[0].name;
            dayDiv.appendChild(reservationIndicator);
        }
        if (ordersForDay.length > 0) {
            dayDiv.classList.add('has-order');
            const orderIndicator = document.createElement('div');
            orderIndicator.classList.add('order-indicator');
            if (ordersForDay.some(r => r.status === 'Pendente')) {
                orderIndicator.classList.add('pending-indicator');
            }
            orderIndicator.textContent = ordersForDay[0].name;
            dayDiv.appendChild(orderIndicator);
        }

        dayDiv.addEventListener('click', () => handleDayClick(formattedDate));
        DOM.calendarGrid.appendChild(dayDiv);
    }
}

function handleDayClick(dateString, itemType = 'reservation', prefillName = '', prefillPhone = '') { // Added prefill parameters
    selectedDate = new Date(dateString + 'T00:00:00');
    DOM.modalSelectedDate.textContent = getDisplayDate(dateString);

    resetItemForm();
    DOM.itemTypeSelect.value = itemType; // Set item type based on parameter
    toggleItemFields();
    DOM.courtesySearchInput.value = '';
    renderCourtesyOptions();

    // Prefill if provided
    DOM.nameInput.value = prefillName;
    DOM.phoneInput.value = maskPhoneNumber(prefillPhone);

    DOM.calendarGrid.querySelectorAll('.calendar-day.selected-day').forEach(el => {
        el.classList.remove('selected-day');
    });

    const clickedDayElement = DOM.calendarGrid.querySelector(`.calendar-day[data-date="${dateString}"]`);
    if (clickedDayElement) {
        clickedDayElement.classList.add('selected-day');
    }

    renderExistingItems(dateString);

    openModal(DOM.itemModalOverlay);
}

async function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
    await loadItems(currentMonth.getMonth() + 1, currentMonth.getFullYear());
    renderCalendar();
}

// --- Funções de Gerenciamento de Itens (CRUD no modal) ---

function renderExistingItems(dateString) {
    DOM.itemListContainer.innerHTML = '';
    const dailyItems = items.filter(item => item.date === dateString)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (dailyItems.length === 0) {
        DOM.noItemsMessage.style.display = 'block';
        DOM.existingItemsContainer.style.display = 'none';
    } else {
        DOM.noItemsMessage.style.display = 'none';
        DOM.existingItemsContainer.style.display = 'block';
        DOM.existingItemsTitle.textContent = `Itens Existentes (${dailyItems.length}):`;


        dailyItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item-item');
            itemElement.classList.add(item.type === 'reservation' ? 'reservation-item' : 'order-item');
            itemElement.dataset.id = item.id;

            const displayPhone = maskPhoneNumber(item.phone.startsWith('55') ? item.phone.substring(2) : item.phone);
            const whatsappLink = `https://wa.me/${item.phone}`;
            const statusClass = item.status === 'Pendente' ? 'status-pendente' : 'status-confirmado';
            const statusLabel = item.status || 'Confirmado';

            let itemDetailsHTML = '';
            if (item.type === 'reservation') {
                itemDetailsHTML = `
                    <p class="time">${item.time} - Reserva <span class="status-badge ${statusClass}">${statusLabel}</span></p>
                    <p class="name">${item.name} (${item.qtyPeople} pessoas)</p>
                    <p class="phone">${displayPhone}</p>
                    ${item.observations ? `<p class="observations">Obs: ${item.observations.substring(0, 50)}${item.observations.length > 50 ? '...' : ''}</p>` : ''}
                    ${item.isBirthday ? `<p class="birthday-info">🎉 <strong>Aniversariante:</strong> ${item.courtesy || 'Não especificado'}</p>` : ''}
                `;
            } else { // type === 'order'
                itemDetailsHTML = `
                    <p class="time">${item.time} - Pedido <span class="status-badge ${statusClass}">${statusLabel}</span></p>
                    <p class="name">${item.name}</p>
                    <p class="phone">${displayPhone}</p>
                    <p class="description">${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}</p>
                `;
            }

            itemElement.innerHTML = `
                <div class="item-details">
                    ${itemDetailsHTML}
                </div>
                <div class="item-actions">
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-link" title="Falar no WhatsApp">
                        <span class="mdi mdi-whatsapp"></span>
                    </a>
                    <button type="button" class="print" data-id="${item.id}" title="Imprimir">
                        <span class="mdi mdi-printer"></span>
                    </button>
                    <button type="button" class="edit" data-id="${item.id}" title="Editar">
                        <span class="mdi mdi-pencil"></span>
                    </button>
                    <button type="button" class="delete" data-id="${item.id}" title="Excluir">
                        <span class="mdi mdi-delete"></span>
                    </button>
                </div>
            `;
            DOM.itemListContainer.appendChild(itemElement);
        });

        DOM.itemListContainer.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                editItem(e.currentTarget.dataset.id);
            });
        });
        DOM.itemListContainer.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                deleteItem(e.currentTarget.dataset.id, dateString);
            });
        });
        DOM.itemListContainer.querySelectorAll('.print').forEach(button => {
            button.addEventListener('click', (e) => {
                printItem(e.currentTarget.dataset.id);
            });
        });
    }
}

function resetItemForm() {
    DOM.itemForm.reset();
    DOM.itemIdInput.value = '';
    DOM.qtyPeopleInput.value = 1;
    DOM.statusSelect.value = 'Confirmado';
    DOM.itemTypeSelect.value = 'reservation'; // Padrão para reserva
    DOM.observationsInput.value = ''; // Clear observations
    DOM.isBirthdayCheckbox.checked = false; // Uncheck birthday checkbox
    selectedCourtesy = null; // Reset selected courtesy
    DOM.newCourtesyNameInput.value = ''; // Clear new courtesy input
    DOM.courtesySearchInput.value = ''; // Clear search input
    renderCourtesyOptions(); // Re-render courtesy options to clear selection and hide input
    toggleItemFields(); // Garante que os campos corretos sejam mostrados
    DOM.formTitle.textContent = 'Adicionar Novo Item';
    DOM.saveItemButton.textContent = 'Salvar Item';

    // NEW: Hide contact search results in item modal
    DOM.contactSearchResults.innerHTML = '';
    DOM.contactSearchResults.classList.remove('visible');
}

function toggleItemFields() {
    const selectedType = DOM.itemTypeSelect.value;
    if (selectedType === 'reservation') {
        DOM.reservationSpecificFields.style.display = 'block';
        DOM.orderFields.style.display = 'none';

        DOM.qtyPeopleInput.setAttribute('required', 'required');
        DOM.orderDescriptionInput.removeAttribute('required');

        toggleBirthdayFields();
    } else { // 'order'
        DOM.reservationSpecificFields.style.display = 'none';
        DOM.orderFields.style.display = 'block';

        DOM.qtyPeopleInput.removeAttribute('required');
        DOM.orderDescriptionInput.setAttribute('required', 'required');
    }
}
DOM.itemTypeSelect.addEventListener('change', toggleItemFields);

function toggleBirthdayFields() {
    if (DOM.isBirthdayCheckbox.checked) {
        DOM.courtesyFields.style.display = 'block';
    } else {
        DOM.courtesyFields.style.display = 'none';
        DOM.addCourtesyInput.style.display = 'none';
        selectedCourtesy = null;
        renderCourtesyOptions();
    }
}
DOM.isBirthdayCheckbox.addEventListener('change', toggleBirthdayFields);

function renderCourtesyOptions(filter = '') {
    DOM.courtesyOptionsList.innerHTML = '';

    const filteredCourtesies = courtesies
        .filter(c => c.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));

    if (filteredCourtesies.length === 0 && filter === '') {
        DOM.noCourtesiesMessage.style.display = 'block';
        DOM.courtesyOptionsList.appendChild(DOM.noCourtesiesMessage);
    } else {
        DOM.noCourtesiesMessage.style.display = 'none';
        filteredCourtesies.forEach(courtesyName => {
            const courtesyItem = document.createElement('div');
            courtesyItem.classList.add('courtesy-item');
            courtesyItem.dataset.value = courtesyName;
            courtesyItem.textContent = courtesyName;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-courtesy-button');
            deleteButton.type = 'button';
            deleteButton.innerHTML = '<span class="mdi mdi-close-circle"></span>';
            deleteButton.title = `Apagar "${courtesyName}"`;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCourtesy(courtesyName);
            });

            courtesyItem.appendChild(deleteButton);

            courtesyItem.addEventListener('click', () => {
                DOM.courtesyOptionsList.querySelectorAll('.courtesy-item').forEach(item => item.classList.remove('selected'));
                courtesyItem.classList.add('selected');
                selectedCourtesy = courtesyName;
                DOM.addCourtesyInput.style.display = 'none';
                DOM.newCourtesyNameInput.removeAttribute('required');
            });

            if (selectedCourtesy === courtesyName) {
                courtesyItem.classList.add('selected');
            }

            DOM.courtesyOptionsList.appendChild(courtesyItem);
        });
    }

    const addCourtesyItem = document.createElement('div');
    addCourtesyItem.classList.add('courtesy-item');
    addCourtesyItem.dataset.value = 'add_new';
    addCourtesyItem.innerHTML = '<span class="mdi mdi-plus-circle"></span> Adicionar nova cortesia...';
    addCourtesyItem.addEventListener('click', () => {
        DOM.courtesyOptionsList.querySelectorAll('.courtesy-item').forEach(item => item.classList.remove('selected'));
        selectedCourtesy = null;
        addCourtesyItem.classList.add('selected');
        DOM.addCourtesyInput.style.display = 'block';
        DOM.newCourtesyNameInput.setAttribute('required', 'required');
        DOM.newCourtesyNameInput.focus();
    });
    DOM.courtesyOptionsList.appendChild(addCourtesyItem);
}

DOM.courtesySearchInput.addEventListener('input', (e) => {
    renderCourtesyOptions(e.target.value);
});

function deleteCourtesy(courtesyName) {
    openModal(DOM.alertModalOverlay, 'Confirmar Exclusão', `Tem certeza que deseja apagar a cortesia "${courtesyName}"?`, 'danger');
    DOM.alertModalOverlay.querySelector('.primary-button').textContent = 'Confirmar';
    DOM.alertModalOverlay.querySelector('.primary-button').onclick = () => {
        courtesies = courtesies.filter(c => c !== courtesyName);
        if (selectedCourtesy === courtesyName) {
            selectedCourtesy = null;
        }
        saveItems();
        renderCourtesyOptions(DOM.courtesySearchInput.value);
        closeModal(DOM.alertModalOverlay);
        openModal(DOM.alertModalOverlay, 'Sucesso!', `Cortesia "${courtesyName}" apagada com sucesso.`, 'success');
    };
}

DOM.addCourtesyButton.addEventListener('click', () => {
    const newCourtesyName = DOM.newCourtesyNameInput.value.trim();
    if (newCourtesyName) {
        if (!courtesies.includes(newCourtesyName)) {
            courtesies.push(newCourtesyName);
            saveItems();
            DOM.courtesySearchInput.value = '';
            renderCourtesyOptions();

            const newCourtesyElement = DOM.courtesyOptionsList.querySelector(`[data-value="${newCourtesyName}"]`);
            if (newCourtesyElement) {
                DOM.courtesyOptionsList.querySelectorAll('.courtesy-item').forEach(item => item.classList.remove('selected'));
                newCourtesyElement.classList.add('selected');
                selectedCourtesy = newCourtesyName;
            }

            DOM.addCourtesyInput.style.display = 'none';
            DOM.newCourtesyNameInput.value = '';
            DOM.newCourtesyNameInput.removeAttribute('required');
        } else {
            openModal(DOM.alertModalOverlay, 'Aviso', 'Esta cortesia já existe.', 'info');
        }
    } else {
        openModal(DOM.alertModalOverlay, 'Aviso', 'Por favor, digite o nome da nova cortesia.', 'info');
    }
});


function editItem(id) {
    const itemToEdit = items.find(item => item.id == id);
    if (itemToEdit) {
        DOM.itemIdInput.value = itemToEdit.id;
        DOM.statusSelect.value = itemToEdit.status || 'Confirmado';
        DOM.itemTypeSelect.value = itemToEdit.type;
        toggleItemFields();

        DOM.phoneInput.value = maskPhoneNumber(itemToEdit.phone.startsWith('55') ? itemToEdit.phone.substring(2) : itemToEdit.phone);
        DOM.nameInput.value = itemToEdit.name;
        DOM.itemTimeInput.value = itemToEdit.time;

        if (itemToEdit.type === 'reservation') {
            DOM.qtyPeopleInput.value = itemToEdit.qtyPeople;
            DOM.observationsInput.value = itemToEdit.observations || '';
            DOM.isBirthdayCheckbox.checked = itemToEdit.isBirthday || false;
            toggleBirthdayFields();

            if (itemToEdit.isBirthday && itemToEdit.courtesy) {
                selectedCourtesy = itemToEdit.courtesy;
                DOM.courtesySearchInput.value = '';
                renderCourtesyOptions();
            } else {
                selectedCourtesy = null;
                renderCourtesyOptions();
            }
        } else { // 'order'
            DOM.orderDescriptionInput.value = itemToEdit.description;
        }

        DOM.formTitle.textContent = 'Editar Item';
        DOM.saveItemButton.textContent = 'Atualizar Item';
        DOM.itemForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function deleteItem(id, dateString) {
    openModal(DOM.alertModalOverlay, 'Confirmar Exclusão', 'Tem certeza que deseja excluir este item?', 'danger');
    DOM.alertModalOverlay.querySelector('.primary-button').textContent = 'Confirmar';
    DOM.alertModalOverlay.querySelector('.primary-button').onclick = async () => {
        try {
            await deleteItemApi(id, dateString);
            closeModal(DOM.alertModalOverlay);
            renderCalendar();
            renderUpcomingItems();
            renderOrdersList();
            renderExistingItems(dateString);
            openModal(DOM.alertModalOverlay, 'Sucesso!', 'Item excluído com sucesso.', 'success');
        } catch (error) {
            openModal(DOM.alertModalOverlay, 'Erro', 'Não foi possível excluir o item.', 'error');
        }
    };
}

function printItem(id) {
    const itemToPrint = items.find(item => item.id == id);
    if (itemToPrint) {
        const formattedDate = getDisplayDate(itemToPrint.date);
        const displayPhone = maskPhoneNumber(itemToPrint.phone.startsWith('55') ? itemToPrint.phone.substring(2) : itemToPrint.phone);

        let printContent = `
            <h1>Detalhes do Agendamento</h1>
            <p><strong>Tipo:</strong> ${itemToPrint.type === 'reservation' ? 'Reserva' : 'Pedido'}</p>
            <p><strong>Nome:</strong> ${itemToPrint.name}</p>
            <p><strong>Telefone:</strong> ${displayPhone}</p>
            <p><strong>Data:</strong> ${formattedDate}</p>
            <p><strong>Horário:</strong> ${itemToPrint.time}</p>
        `;

        if (itemToPrint.type === 'reservation') {
            printContent += `<p><strong>Quantidade de Pessoas:</strong> ${itemToPrint.qtyPeople}</p>`;
            if (itemToPrint.observations) {
                printContent += `<h2>Observações:</h2><p>${itemToPrint.observations.replace(/\n/g, '<br>')}</p>`;
            }
            if (itemToPrint.isBirthday) {
                printContent += `<p><strong>Aniversariante:</strong> Sim</p>`;
                if (itemToPrint.courtesy) {
                    printContent += `<p><strong>Cortesia:</strong> ${itemToPrint.courtesy}</p>`;
                }
            }
        } else { // type === 'order'
            printContent += `<h2>Detalhes do Pedido:</h2><p>${itemToPrint.description.replace(/\n/g, '<br>')}</p>`;
        }

        DOM.printModal.innerHTML = printContent;
        window.print();
    } else {
        openModal(DOM.alertModalOverlay, 'Erro', 'Item não encontrado para impressão.', 'error');
    }
}

// --- Funções da Aba "Próximas Reservas" ---
function renderUpcomingItems(filter = '') {
    DOM.upcomingListContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = getFormattedDate(today);

    const upcomingReservations = items
        .filter(item => {
            const matchesType = item.type === 'reservation' && item.date >= todayFormatted;
            if (!matchesType) return false;

            const searchTerm = normalizeString(filter);
            const normalizedName = normalizeString(item.name);
            const normalizedObs = normalizeString(item.observations);
            const rawPhone = item.phone.replace(/\D/g, '');

            return normalizedName.includes(searchTerm) ||
                (item.observations && normalizedObs.includes(searchTerm)) ||
                rawPhone.includes(searchTerm);
        })
        .sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.time.localeCompare(b.time);
        });

    if (upcomingReservations.length === 0) {
        DOM.noUpcomingItemsMessage.style.display = 'block';
        if (!DOM.upcomingListContainer.contains(DOM.noUpcomingItemsMessage)) {
            DOM.upcomingListContainer.appendChild(DOM.noUpcomingItemsMessage);
        }
        return;
    } else {
        DOM.noUpcomingItemsMessage.style.display = 'none';
    }

    let currentDateGroup = null;
    let currentGroupElement = null;

    upcomingReservations.forEach(item => {
        if (item.date !== currentDateGroup) {
            currentDateGroup = item.date;
            currentGroupElement = document.createElement('div');
            currentGroupElement.classList.add('upcoming-date-group');
            DOM.upcomingListContainer.appendChild(currentGroupElement);

            const dateHeader = document.createElement('h4');
            dateHeader.textContent = getDisplayDate(item.date);
            currentGroupElement.appendChild(dateHeader);
        }

        const itemElement = document.createElement('div');
        itemElement.classList.add('upcoming-item');

        const displayPhone = maskPhoneNumber(item.phone.startsWith('55') ? item.phone.substring(2) : item.phone);
        const whatsappLink = `https://wa.me/${item.phone}`;
        const statusClass = item.status === 'Pendente' ? 'status-pendente' : 'status-confirmado';
        const statusLabel = item.status || 'Confirmado';

        let itemDetailsHTML = `
            <p class="time">${item.time} - Reserva <span class="status-badge ${statusClass}">${statusLabel}</span></p>
            <p class="name-qty">${item.name} (${item.qtyPeople} pessoas)</p>
            <p class="phone">${displayPhone}</p>
            ${item.observations ? `<p class="observations">Obs: ${item.observations.substring(0, 70)}${item.observations.length > 70 ? '...' : ''}</p>` : ''}
            ${item.isBirthday ? `<p class="birthday-info">🎉 <strong>Aniversariante:</strong> ${item.courtesy || 'Não especificado'}</p>` : ''}
        `;


        itemElement.innerHTML = `
            <div class="upcoming-item-details">
                ${itemDetailsHTML}
            </div>
            <div class="upcoming-item-actions">
                <a href="${whatsappLink}" target="_blank" class="whatsapp-link" title="Falar no WhatsApp">
                    <span class="mdi mdi-whatsapp"></span>
                </a>
                <button type="button" class="print" data-id="${item.id}" title="Imprimir">
                    <span class="mdi mdi-printer"></span>
                </button>
                <button type="button" class="edit" data-id="${item.id}" data-date="${item.date}" title="Editar">
                    <span class="mdi mdi-pencil"></span>
                </button>
                <button type="button" class="delete" data-id="${item.id}" data-date="${item.date}" title="Excluir">
                    <span class="mdi mdi-delete"></span>
                </button>
            </div>
        `;
        currentGroupElement.appendChild(itemElement);
    });

    DOM.upcomingListContainer.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const date = e.currentTarget.dataset.date;
            handleDayClick(date);
            editItem(id);
        });
    });
    DOM.upcomingListContainer.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const date = e.currentTarget.dataset.date;
            deleteItem(id, date);
        });
    });
    DOM.upcomingListContainer.querySelectorAll('.print').forEach(button => {
        button.addEventListener('click', (e) => {
            printItem(e.currentTarget.dataset.id);
        });
    });
}

// Função para renderizar a lista de Pedidos
function renderOrdersList(filter = '') {
    DOM.orderListContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = getFormattedDate(today);

    const pendingOrders = items
        .filter(item => {
            const matchesType = item.type === 'order' && item.date >= todayFormatted;
            if (!matchesType) return false;

            const searchTerm = normalizeString(filter);
            const normalizedName = normalizeString(item.name);
            const normalizedDesc = normalizeString(item.description);
            const rawPhone = item.phone.replace(/\D/g, '');

            return normalizedName.includes(searchTerm) ||
                (item.description && normalizedDesc.includes(searchTerm)) ||
                rawPhone.includes(searchTerm);
        })
        .sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.time.localeCompare(b.time);
        });

    if (pendingOrders.length === 0) {
        DOM.noOrdersMessage.style.display = 'block';
        if (!DOM.orderListContainer.contains(DOM.noOrdersMessage)) {
            DOM.orderListContainer.appendChild(DOM.noOrdersMessage);
        }
        return;
    } else {
        DOM.noOrdersMessage.style.display = 'none';
    }

    let currentDateGroup = null;
    let currentGroupElement = null;

    pendingOrders.forEach(order => {
        if (order.date !== currentDateGroup) {
            currentDateGroup = order.date;
            currentGroupElement = document.createElement('div');
            currentGroupElement.classList.add('upcoming-date-group');
            DOM.orderListContainer.appendChild(currentGroupElement);

            const dateHeader = document.createElement('h4');
            dateHeader.textContent = getDisplayDate(order.date);
            currentGroupElement.appendChild(dateHeader);
        }

        const orderElement = document.createElement('div');
        orderElement.classList.add('upcoming-item');
        orderElement.classList.add('order-item-detail');

        const displayPhone = maskPhoneNumber(order.phone.startsWith('55') ? order.phone.substring(2) : order.phone);
        const whatsappLink = `https://wa.me/${order.phone}`;
        const statusClass = order.status === 'Pendente' ? 'status-pendente' : 'status-confirmado';
        const statusLabel = order.status || 'Confirmado';

        orderElement.innerHTML = `
            <div class="upcoming-item-details">
                <p class="time">${order.time} - Pedido <span class="status-badge ${statusClass}">${statusLabel}</span></p>
                <p class="name-qty">${order.name}</p>
                <p class="phone">${displayPhone}</p>
                <p class="description">${order.description.substring(0, 70)}${order.description.length > 70 ? '...' : ''}</p>
            </div>
            <div class="upcoming-item-actions">
                <a href="${whatsappLink}" target="_blank" class="whatsapp-link" title="Falar no WhatsApp">
                    <span class="mdi mdi-whatsapp"></span>
                </a>
                <button type="button" class="print" data-id="${order.id}" title="Imprimir Pedido">
                    <span class="mdi mdi-printer"></span>
                </button>
                <button type="button" class="edit" data-id="${order.id}" data-date="${order.date}" title="Editar Pedido">
                    <span class="mdi mdi-pencil"></span>
                </button>
                <button type="button" class="delete" data-id="${order.id}" data-date="${order.date}" title="Excluir Pedido">
                    <span class="mdi mdi-delete"></span>
                </button>
            </div>
        `;
        currentGroupElement.appendChild(orderElement);
    });

    DOM.orderListContainer.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const date = e.currentTarget.dataset.date;
            handleDayClick(date, 'order'); // Abre o modal no modo pedido
            editItem(id);
        });
    });
    DOM.orderListContainer.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const date = e.currentTarget.dataset.date;
            deleteItem(id, date);
        });
    });
    DOM.orderListContainer.querySelectorAll('.print').forEach(button => {
        button.addEventListener('click', (e) => {
            printItem(e.currentTarget.dataset.id);
        });
    });
}

// --- Funções da Aba "Contatos" (NEW) ---
function renderContacts(filter = '') {
    DOM.contactListContainer.innerHTML = '';

    const searchTerm = normalizeString(filter);

    const filteredContacts = contacts
        .filter(contact => {
            const normalizedName = normalizeString(contact.name);
            const normalizedNotes = normalizeString(contact.notes);
            const rawPhone = contact.phone.replace(/\D/g, '');

            return normalizedName.includes(searchTerm) ||
                normalizedNotes.includes(searchTerm) ||
                rawPhone.includes(searchTerm);
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredContacts.length === 0) {
        DOM.noContactsMessage.style.display = 'block';
        if (!DOM.contactListContainer.contains(DOM.noContactsMessage)) {
            DOM.contactListContainer.appendChild(DOM.noContactsMessage);
        }
    } else {
        DOM.noContactsMessage.style.display = 'none';
        filteredContacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.classList.add('contact-item');
            contactElement.dataset.id = contact.id;

            const displayPhone = maskPhoneNumber(contact.phone.startsWith('55') ? contact.phone.substring(2) : contact.phone);
            const whatsappLink = `https://wa.me/${contact.phone}`;

            contactElement.innerHTML = `
                <div class="contact-details">
                    <h3>${contact.name}</h3>
                    <p>${displayPhone}</p>
                    ${contact.notes ? `<p class="contact-notes">${contact.notes.substring(0, 100)}${contact.notes.length > 100 ? '...' : ''}</p>` : ''}
                </div>
                <div class="contact-actions">
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-link" title="Falar no WhatsApp">
                        <span class="mdi mdi-whatsapp"></span> WhatsApp
                    </a>
                    <button type="button" class="create-reservation" data-id="${contact.id}" title="Gerar Reserva">
                        <span class="mdi mdi-calendar-plus"></span> Reserva
                    </button>
                    <button type="button" class="create-order" data-id="${contact.id}" title="Gerar Pedido">
                        <span class="mdi mdi-cart-plus"></span> Pedido
                    </button>
                    <button type="button" class="edit" data-id="${contact.id}" title="Editar Contato">
                        <span class="mdi mdi-pencil"></span>
                    </button>
                    <button type="button" class="delete" data-id="${contact.id}" title="Excluir Contato">
                        <span class="mdi mdi-delete"></span>
                    </button>
                </div>
            `;
            DOM.contactListContainer.appendChild(contactElement);
        });

        DOM.contactListContainer.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                editContact(e.currentTarget.dataset.id);
            });
        });
        DOM.contactListContainer.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                deleteContact(e.currentTarget.dataset.id);
            });
        });
        DOM.contactListContainer.querySelectorAll('.create-reservation').forEach(button => {
            button.addEventListener('click', (e) => {
                const contact = contacts.find(c => c.id == e.currentTarget.dataset.id);
                if (contact) {
                    // Automatically select today's date for a new reservation/order from contact
                    const today = getFormattedDate(new Date());
                    handleDayClick(today, 'reservation', contact.name, contact.phone);
                }
            });
        });
        DOM.contactListContainer.querySelectorAll('.create-order').forEach(button => {
            button.addEventListener('click', (e) => {
                const contact = contacts.find(c => c.id == e.currentTarget.dataset.id);
                if (contact) {
                    const today = getFormattedDate(new Date());
                    handleDayClick(today, 'order', contact.name, contact.phone);
                }
            });
        });
    }
}

function resetContactForm() {
    DOM.contactForm.reset();
    DOM.contactIdInput.value = '';
    DOM.contactModalTitle.textContent = 'Adicionar Contato';
    DOM.saveContactButton.textContent = 'Salvar Contato';
}

function editContact(id) {
    const contactToEdit = contacts.find(contact => contact.id == id);
    if (contactToEdit) {
        DOM.contactIdInput.value = contactToEdit.id;
        DOM.contactNameInput.value = contactToEdit.name;
        DOM.contactPhoneInput.value = maskPhoneNumber(contactToEdit.phone.startsWith('55') ? contactToEdit.phone.substring(2) : contactToEdit.phone);
        DOM.contactNotesInput.value = contactToEdit.notes || '';

        DOM.contactModalTitle.textContent = 'Editar Contato';
        DOM.saveContactButton.textContent = 'Atualizar Contato';
        openModal(DOM.contactFormModalOverlay);
    }
}

function deleteContact(id) {
    openModal(DOM.alertModalOverlay, 'Confirmar Exclusão', 'Tem certeza que deseja excluir este contato? Isso não apagará reservas ou pedidos associados.', 'danger');
    DOM.alertModalOverlay.querySelector('.primary-button').textContent = 'Confirmar';
    DOM.alertModalOverlay.querySelector('.primary-button').onclick = () => {
        contacts = contacts.filter(contact => contact.id != id);
        saveItems(); // Save contacts after deletion
        closeModal(DOM.alertModalOverlay);
        renderContacts(DOM.contactsSearchInput.value); // Re-render with current filter
        openModal(DOM.alertModalOverlay, 'Sucesso!', 'Contato excluído com sucesso.', 'success');
    };
}

// --- NEW: Function to search contacts in item modal ---
function searchContactsInItemModal(filter) {
    DOM.contactSearchResults.innerHTML = '';
    if (filter.length < 2) { // Only search if at least 2 characters are typed
        DOM.contactSearchResults.classList.remove('visible');
        return;
    }

    const searchTerm = normalizeString(filter);

    const filteredContacts = contacts.filter(contact => {
        const normalizedName = normalizeString(contact.name);
        const rawPhone = contact.phone.replace(/\D/g, '');

        return normalizedName.includes(searchTerm) || rawPhone.includes(searchTerm);
    }).sort((a, b) => a.name.localeCompare(b.name));

    if (filteredContacts.length === 0) {
        DOM.contactSearchResults.classList.remove('visible');
        return;
    }

    filteredContacts.forEach(contact => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('contact-search-result-item');
        resultItem.innerHTML = `<span>${contact.name}</span><small>${maskPhoneNumber(contact.phone.startsWith('55') ? contact.phone.substring(2) : contact.phone)}</small>`;
        resultItem.addEventListener('click', () => {
            DOM.nameInput.value = contact.name;
            DOM.phoneInput.value = maskPhoneNumber(contact.phone.startsWith('55') ? contact.phone.substring(2) : contact.phone);
            DOM.contactSearchResults.classList.remove('visible');
        });
        DOM.contactSearchResults.appendChild(resultItem);
    });
    DOM.contactSearchResults.classList.add('visible');
}

// --- Funções de Navegação de Abas ---
function showView(viewId) {
    DOM.calendarView.style.display = 'none';
    DOM.upcomingItemsView.style.display = 'none';
    DOM.ordersView.style.display = 'none';
    DOM.contactsView.style.display = 'none'; // NEW
    DOM.settingsView.style.display = 'none';

    DOM.calendarTab.classList.remove('active');
    DOM.upcomingItemsTab.classList.remove('active');
    DOM.ordersTab.classList.remove('active');
    DOM.contactsTab.classList.remove('active'); // NEW
    DOM.settingsTab.classList.remove('active');

    const selectedView = document.getElementById(viewId);
    selectedView.style.display = 'block';

    if (viewId === 'calendar-view') {
        DOM.calendarTab.classList.add('active');
        renderCalendar();
    } else if (viewId === 'upcoming-items-view') {
        DOM.upcomingItemsTab.classList.add('active');
        renderUpcomingItems(DOM.upcomingSearchInput.value);
    } else if (viewId === 'orders-view') {
        DOM.ordersTab.classList.add('active');
        renderOrdersList(DOM.ordersSearchInput.value);
    } else if (viewId === 'contacts-view') { // NEW
        DOM.contactsTab.classList.add('active');
        renderContacts(DOM.contactsSearchInput.value); // Render contacts with current filter
    } else if (viewId === 'settings-view') {
        DOM.settingsTab.classList.add('active');
        renderSettings();
    }
}

// --- Funções de Settings ---
async function renderSettings() {
    currentSettings = await loadSettingsApi();
    if (!currentSettings) return;

    DOM.settingsDaysInput.value = currentSettings.schedules.days.join(', ');
    DOM.settingsHoursInput.value = currentSettings.schedules.hours.join(', ');
    DOM.settingsMinPeopleInput.value = currentSettings.schedules.minPeople;
    DOM.settingsCourtesyRuleInput.value = currentSettings.courtesies.rule;
    DOM.settingsPixKeyInput.value = currentSettings.pix.key;
    DOM.settingsPixOwnerInput.value = currentSettings.pix.owner;
    DOM.settingsPixCityInput.value = currentSettings.pix.city;
    DOM.settingsPricePerKgInput.value = currentSettings.pix.pricePerKg;
    DOM.settingsWhatsappInput.value = currentSettings.whatsappNumber || '';

    renderCourtesyTags();
}

function renderCourtesyTags() {
    DOM.settingsCourtesyOptionsContainer.innerHTML = '';
    currentSettings.courtesies.options.forEach(option => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerHTML = `${option} <span class="mdi mdi-close" data-option="${option}"></span>`;
        tag.querySelector('.mdi-close').addEventListener('click', (e) => {
            const opt = e.target.dataset.option;
            currentSettings.courtesies.options = currentSettings.courtesies.options.filter(o => o !== opt);
            renderCourtesyTags();
        });
        DOM.settingsCourtesyOptionsContainer.appendChild(tag);
    });
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadItems(currentMonth.getMonth() + 1, currentMonth.getFullYear());
    // cleanOldItems(); // Backend handles persistence now
    renderCalendar();
    renderUpcomingItems();
    renderOrdersList();
    renderContacts(); // NEW
    toggleItemFields();
    renderCourtesyOptions();

    DOM.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    DOM.nextMonthBtn.addEventListener('click', () => changeMonth(1));

    DOM.closeItemModalBtn.addEventListener('click', () => closeModal(DOM.itemModalOverlay));
    DOM.closeAlertModalBtn.addEventListener('click', () => closeModal(DOM.alertModalOverlay));
    DOM.closeContactModalBtn.addEventListener('click', () => closeModal(DOM.contactFormModalOverlay)); // NEW
    DOM.closeCacheAlertModalBtn.addEventListener('click', () => closeModal(DOM.cacheAlertModalOverlay)); // NEW

    DOM.itemModalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.itemModalOverlay) {
            closeModal(DOM.itemModalOverlay);
        }
    });
    DOM.alertModalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.alertModalOverlay) {
            closeModal(DOM.alertModalOverlay);
        }
    });
    DOM.contactFormModalOverlay.addEventListener('click', (e) => { // NEW
        if (e.target === DOM.contactFormModalOverlay) {
            closeModal(DOM.contactFormModalOverlay);
        }
    });
    DOM.cacheAlertModalOverlay.addEventListener('click', (e) => { // NEW
        if (e.target === DOM.cacheAlertModalOverlay) {
            closeModal(DOM.cacheAlertModalOverlay);
        }
    });

    // NEW: Hide contact search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!DOM.nameInput.contains(e.target) && !DOM.contactSearchResults.contains(e.target)) {
            DOM.contactSearchResults.classList.remove('visible');
        }
    });

    DOM.calendarTab.addEventListener('click', () => showView('calendar-view'));
    DOM.upcomingItemsTab.addEventListener('click', () => showView('upcoming-items-view'));
    DOM.ordersTab.addEventListener('click', () => showView('orders-view'));
    DOM.contactsTab.addEventListener('click', () => showView('contacts-view')); // NEW
    DOM.settingsTab.addEventListener('click', () => showView('settings-view'));

    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = DOM.adminPasswordInput.value;
        const success = await loginApi(password);
        if (success) {
            DOM.loginOverlay.classList.remove('visible');
            DOM.app.style.display = 'block';
            sessionStorage.setItem('admin_auth', 'true');
        } else {
            DOM.loginError.style.display = 'block';
        }
    });

    if (sessionStorage.getItem('admin_auth') === 'true') {
        DOM.loginOverlay.classList.remove('visible');
        DOM.app.style.display = 'block';
    }

    DOM.addTagButton.addEventListener('click', () => {
        const val = DOM.newTagInput.value.trim();
        if (val && !currentSettings.courtesies.options.includes(val)) {
            currentSettings.courtesies.options.push(val);
            renderCourtesyTags();
            DOM.newTagInput.value = '';
        }
    });

    DOM.settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedSettings = {
            schedules: {
                days: DOM.settingsDaysInput.value.split(',').map(s => s.trim()),
                hours: DOM.settingsHoursInput.value.split(',').map(s => s.trim()),
                minPeople: parseInt(DOM.settingsMinPeopleInput.value)
            },
            courtesies: {
                rule: DOM.settingsCourtesyRuleInput.value,
                options: currentSettings.courtesies.options
            },
            pix: {
                key: DOM.settingsPixKeyInput.value,
                owner: DOM.settingsPixOwnerInput.value,
                city: DOM.settingsPixCityInput.value,
                pricePerKg: parseFloat(DOM.settingsPricePerKgInput.value)
            },
            whatsappNumber: DOM.settingsWhatsappInput.value.trim()
        };

        try {
            await saveSettingsApi(updatedSettings);
            openModal(DOM.alertModalOverlay, 'Sucesso!', 'Configurações salvas com sucesso!', 'success');
            courtesies = updatedSettings.courtesies.options; // Sync old local array
            renderCourtesyOptions();
        } catch (error) {
            openModal(DOM.alertModalOverlay, 'Erro', 'Não foi possível salvar as configurações.', 'error');
        }
    });

    // NEW: Event listener for main "Add Contact" button
    DOM.addContactButtonMain.addEventListener('click', () => {
        resetContactForm();
        openModal(DOM.contactFormModalOverlay);
    });

    // NEW: Event listener for "Save Contact from Item" button
    DOM.saveContactFromItemButton.addEventListener('click', () => {
        const name = DOM.nameInput.value.trim();
        let rawPhone = DOM.phoneInput.value.replace(/\D/g, '');
        if (rawPhone.length < 10) { // Basic phone validation
            openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, insira um telefone válido para salvar o contato.', 'info');
            return;
        }
        const phoneForContact = `55${rawPhone}`;

        // Check if contact already exists
        const existingContact = contacts.find(c => c.phone === phoneForContact);
        if (existingContact) {
            openModal(DOM.alertModalOverlay, 'Aviso', `O contato "${existingContact.name}" com este telefone já existe.`, 'info');
        } else {
            const newContact = {
                id: Date.now(),
                name: name || 'Novo Contato', // If name is empty, provide a default
                phone: phoneForContact,
                notes: '' // No notes from item modal by default
            };
            contacts.push(newContact);
            saveItems();
            openModal(DOM.alertModalOverlay, 'Sucesso!', `Contato "${newContact.name}" salvo com sucesso!`, 'success');
            renderContacts(DOM.contactsSearchInput.value); // Update contacts list
        }
    });

    // NEW: Contact search input listener for contacts view
    DOM.contactsSearchInput.addEventListener('input', (e) => {
        renderContacts(e.target.value);
    });

    // NEW: Search input listeners
    DOM.upcomingSearchInput.addEventListener('input', (e) => {
        renderUpcomingItems(e.target.value);
    });

    DOM.ordersSearchInput.addEventListener('input', (e) => {
        renderOrdersList(e.target.value);
    });

    DOM.nameInput.addEventListener('input', (e) => {
        searchContactsInItemModal(e.target.value);
    });

    // NEW: Contact form submission
    DOM.contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const contactId = DOM.contactIdInput.value;
        const name = DOM.contactNameInput.value.trim();
        let rawPhone = DOM.contactPhoneInput.value.replace(/\D/g, '');
        const notes = DOM.contactNotesInput.value.trim();

        if (rawPhone.length < 10) {
            openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, insira um telefone válido.', 'info');
            return;
        }
        const phoneForContact = `55${rawPhone}`;

        if (contactId) {
            const index = contacts.findIndex(contact => contact.id == contactId);
            if (index !== -1) {
                contacts[index] = {
                    ...contacts[index],
                    name: name,
                    phone: phoneForContact,
                    notes: notes
                };
                openModal(DOM.alertModalOverlay, 'Sucesso!', 'Contato atualizado com sucesso!', 'success');
            }
        } else {
            // Check for duplicate phone number before adding
            const existingContactByPhone = contacts.find(c => c.phone === phoneForContact);
            if (existingContactByPhone) {
                openModal(DOM.alertModalOverlay, 'Aviso', `Já existe um contato com este telefone: ${existingContactByPhone.name}.`, 'info');
                return;
            }

            const newContact = {
                id: Date.now(),
                name: name,
                phone: phoneForContact,
                notes: notes
            };
            contacts.push(newContact);
            openModal(DOM.alertModalOverlay, 'Sucesso!', 'Contato adicionado com sucesso!', 'success');
        }

        saveItems(); // Save the updated contacts list
        closeModal(DOM.contactFormModalOverlay);
        renderContacts(DOM.contactsSearchInput.value); // Re-render the contacts list with current filter
        resetContactForm();
    });


    DOM.itemForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!selectedDate) {
            openModal(DOM.alertModalOverlay, 'Erro', 'Nenhuma data selecionada.', 'error');
            return;
        }

        const date = getFormattedDate(selectedDate);
        const itemId = DOM.itemIdInput.value;
        const status = DOM.statusSelect.value;
        const type = DOM.itemTypeSelect.value;

        let rawPhone = DOM.phoneInput.value.replace(/\D/g, '');
        const name = DOM.nameInput.value.trim();
        const time = DOM.itemTimeInput.value;

        let qtyPeople = null;
        let observations = null;
        let isBirthday = false;
        let courtesy = null;
        let description = null;

        if (rawPhone === '' || !name || !time) {
            openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, preencha os campos de Telefone, Nome e Horário.', 'info');
            return;
        }

        if (type === 'reservation') {
            qtyPeople = parseInt(DOM.qtyPeopleInput.value);
            if (isNaN(qtyPeople) || qtyPeople < 1) {
                openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, informe uma quantidade válida de pessoas para a reserva.', 'info');
                return;
            }
            observations = DOM.observationsInput.value.trim();
            isBirthday = DOM.isBirthdayCheckbox.checked;
            if (isBirthday) {
                if (DOM.addCourtesyInput.style.display === 'block' && DOM.newCourtesyNameInput.value.trim() !== '') {
                    openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, clique em "Adicionar" para a nova cortesia ou selecione uma existente.', 'info');
                    return;
                } else if (!selectedCourtesy) {
                    openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, selecione uma cortesia para o aniversariante.', 'info');
                    return;
                }
                courtesy = selectedCourtesy;
            }
        } else { // type === 'order'
            description = DOM.orderDescriptionInput.value.trim();
            if (!description) {
                openModal(DOM.alertModalOverlay, 'Validação', 'Por favor, preencha a descrição do pedido.', 'info');
                return;
            }
        }

        let phoneForWhatsapp = `55${rawPhone}`;

        const isDuplicate = items.some(
            item => item.date === date && item.time === time && item.type === type && item.id != itemId
        );

        if (isDuplicate) {
            openModal(DOM.alertModalOverlay, 'Erro!', `Já existe um ${type === 'reservation' ? 'reserva' : 'pedido'} para este horário e dia!`, 'error');
            return;
        }

        const itemData = {
            id: itemId || null,
            type: type,
            date: date,
            qtyPeople: qtyPeople,
            phone: phoneForWhatsapp,
            name: name,
            time: time,
            observations: observations,
            isBirthday: isBirthday,
            courtesy: isBirthday ? courtesy : null,
            description: description,
            status: status
        };

        try {
            await saveItem(itemData);
            openModal(DOM.alertModalOverlay, 'Sucesso!', `${type === 'reservation' ? 'Reserva' : 'Pedido'} ${itemId ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
            renderCalendar();
            renderUpcomingItems();
            renderOrdersList();
            renderExistingItems(date);
            resetItemForm();
        } catch (error) {
            openModal(DOM.alertModalOverlay, 'Erro', 'Não foi possível salvar os dados.', 'error');
        }
    });
});
