let settings = null;
let dataSelecionada = "";
let dataAtualFoco = new Date();

document.addEventListener('DOMContentLoaded', async () => {
    await fetchSettings();
    initCustomSelects();
    initCalendar();
    validarFluxo();

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.campo')) {
            fecharTodos();
        }
    });
});

function fecharTodos() {
    document.querySelectorAll('.options-container, .calendar-panel').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.select-simulado').forEach(el => el.classList.remove('active'));
}

// --- CUSTOM SELECTS ---
function initCustomSelects() {
    const selects = document.querySelectorAll('.select-simulado');

    selects.forEach(select => {
        if (select.id === 'data') return; // Data tem lógica de calendário separada

        // Remove listeners antigos se existirem (cloneNode hack ou apenas garantir que não duplicamos)
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        newSelect.addEventListener('click', (e) => {
            const optionsContainer = newSelect.nextElementSibling;
            const isShowing = optionsContainer.classList.contains('show');
            fecharTodos();
            if (!isShowing) {
                newSelect.classList.add('active');
                optionsContainer.classList.add('show');
            }
            e.stopPropagation();
        });

        const optionsContainer = newSelect.nextElementSibling;
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const val = opt.getAttribute('data-value');
                const text = opt.innerText;

                newSelect.setAttribute('data-value', val);
                const span = newSelect.querySelector('span');
                if (span) span.innerText = text;

                newSelect.classList.remove('active');
                optionsContainer.classList.remove('show');

                validarFluxo();
            });
        });
    });
}

// --- CALENDÁRIO ---
function initCalendar() {
    const dataDisplay = document.getElementById('data');
    if (!dataDisplay) return;

    dataDisplay.addEventListener('click', (e) => {
        const isShowing = document.getElementById('calendarPanel').classList.contains('show');
        fecharTodos();
        if (!isShowing) {
            dataDisplay.classList.add('active');
            renderCalendar();
            document.getElementById('calendarPanel').classList.add('show');
        }
        e.stopPropagation();
    });
}

function renderCalendar() {
    const panel = document.getElementById('calendarPanel');
    const grid = panel.querySelector('.calendar-grid');
    const label = document.getElementById('monthYearLabel');

    grid.innerHTML = `
        <div class="calendar-day-header">Dom</div>
        <div class="calendar-day-header">Seg</div>
        <div class="calendar-day-header">Ter</div>
        <div class="calendar-day-header">Qua</div>
        <div class="calendar-day-header">Qui</div>
        <div class="calendar-day-header">Sex</div>
        <div class="calendar-day-header">Sáb</div>
    `;

    const mes = dataAtualFoco.getMonth();
    const ano = dataAtualFoco.getFullYear();

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    label.innerText = `${meses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Espaços vazios
    for (let i = 0; i < primeiroDia; i++) {
        grid.innerHTML += `<div></div>`;
    }

    // Dias do mês
    const diasPermitidos = settings ? settings.schedules.days : ['Segunda', 'Terça', 'Quarta', 'Quinta'];
    const mapaDias = { 'Domingo': 0, 'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6 };
    const indicesPermitidos = diasPermitidos.map(d => mapaDias[d]);

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const d = new Date(ano, mes, dia);
        const diaSemana = d.getDay();
        const isDisabled = !indicesPermitidos.includes(diaSemana) || (d < hoje);
        const isSelected = dataSelecionada === d.toISOString().split('T')[0];
        const isToday = d.getTime() === hoje.getTime();

        const div = document.createElement('div');
        div.className = `calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
        div.innerText = dia;

        if (!isDisabled) {
            div.onclick = () => {
                dataSelecionada = d.toISOString().split('T')[0];
                const displayDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                const diaNome = d.toLocaleDateString('pt-BR', { weekday: 'short' });

                const btnData = document.getElementById('data');
                const span = btnData.querySelector('span');
                if (span) span.innerText = `${diaNome}, ${displayDate}`;
                btnData.setAttribute('data-value', dataSelecionada);

                fecharTodos();
                validarFluxo();
            };
        }
        grid.appendChild(div);
    }
}

function mudarMes(delta) {
    dataAtualFoco.setMonth(dataAtualFoco.getMonth() + delta);
    renderCalendar();
}

function maskPhone(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
        // (00) 00000-0000
        input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
        // (00) 0000-0000
        input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
        // (00) 0000
        input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        // (00)
        input.value = `(${value}`;
    }
}

// --- LÓGICA DE NEGÓCIO ---
async function fetchSettings() {
    try {
        const response = await fetch('/api/settings');
        settings = await response.json();
        updateUIWithSettings();
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
    }
}

function updateUIWithSettings() {
    if (!settings) return;

    // Atualizar Regras
    const regrasBox = document.getElementById('regras-box');
    if (regrasBox) {
        regrasBox.innerHTML = `
            • <b>Dias:</b> ${settings.schedules.days.join(' a ')}.<br>
            • <b>Horário:</b> ${settings.schedules.hours[0]} às ${settings.schedules.hours[settings.schedules.hours.length - 1]}.<br>
            • <b>Cortesia:</b> ${settings.courtesies.rule}.
        `;
    }

    // Atualizar Horários
    const horarioOptionsContainer = document.getElementById('horario-options');
    if (horarioOptionsContainer) {
        horarioOptionsContainer.innerHTML = settings.schedules.hours.map(h => `<div class="option" data-value="${h}">${h}</div>`).join('');
    }

    // Atualizar Sabores de Bolo
    const saborOptionsContainer = document.getElementById('sabor-options');
    if (saborOptionsContainer) {
        saborOptionsContainer.innerHTML = settings.courtesies.options.map(s => `<div class="option" data-value="${s}">${s}</div>`).join('');
        // Update current select text if it doesn't match new options
        const currentSaborContainer = document.getElementById('sabor');
        const currentSabor = currentSaborContainer.getAttribute('data-value');
        if (!settings.courtesies.options.includes(currentSabor)) {
            currentSaborContainer.setAttribute('data-value', settings.courtesies.options[0]);
            currentSaborContainer.querySelector('span').innerText = settings.courtesies.options[0];
        }
    }

    // Re-init custom selects for new options
    initCustomSelects();
}

function validarFluxo() {
    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const dataVal = document.getElementById('data').getAttribute('data-value');
    const horaVal = document.getElementById('horario').getAttribute('data-value');
    const pessoas = document.getElementById('pessoas').getAttribute('data-value');
    const querBolo = document.getElementById('querBolo').getAttribute('data-value');
    const btn = document.getElementById('btnEnviar');
    const painelBolo = document.getElementById('painelBolo');
    const kgInput = document.getElementById('kg');
    const kg = parseFloat(kgInput ? kgInput.value : 1) || 1;
    const divFinanceiro = document.getElementById('detalhesFinanceiros');

    let todosCamposPreenchidos = nome && (whatsapp.length >= 14) && dataVal && horaVal && pessoas;

    if (todosCamposPreenchidos) {
        btn.disabled = false;
        if (querBolo === 'sim') {
            painelBolo.style.display = 'block';
            painelBolo.className = 'secao-bolo modo-cortesia';
            let valorKg = settings ? settings.pix.pricePerKg : 95.00;
            let excedente = Math.max(0, (kg - 1) * valorKg);
            if (excedente > 0) {
                const totalFormatado = excedente.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                const sinalVal = excedente / 2;
                const sinal = sinalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

                document.getElementById('valorTotal').innerText = totalFormatado;
                divFinanceiro.style.display = 'block';

                // Atualizar PIX
                const pixPagamento = document.getElementById('pixPagamento');
                const valorInfo = document.getElementById('valorInfo');
                if (pixPagamento) {
                    pixPagamento.style.display = 'block';
                    const pixCode = generatePixPayload(settings.pix.key, settings.pix.owner, settings.pix.city, sinalVal);
                    document.getElementById('pixCopiaCola').innerText = pixCode;
                    document.getElementById('qrCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixCode)}`;
                }
                if (valorInfo) valorInfo.innerText = `VALOR DO SINAL: R$ ${sinal}`;
            } else {
                divFinanceiro.style.display = 'none';
            }
        } else {
            painelBolo.style.display = 'none';
            divFinanceiro.style.display = 'none';
        }
    } else {
        btn.disabled = true;
        painelBolo.style.display = 'none';
        divFinanceiro.style.display = 'none';
    }
}

// Helper para gerar Payload PIX (Simplificado)
function generatePixPayload(key, owner, city, amount) {
    const amountStr = amount.toFixed(2);
    // Isto é um gerador de payload PIX estático simulado, no mundo real usaria uma lib ou API
    // Mas para manter a compatibilidade com o que estava lá:
    return `00020126510014br.gov.bcb.pix0114${key}52040000530398654${amountStr.length.toString().padStart(2, '0')}${amountStr}5802BR59${owner.length.toString().padStart(2, '0')}${owner}60${city.length.toString().padStart(2, '0')}${city}62070503***6304`;
}

async function enviarWhatsApp() {
    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const dataRaw = document.getElementById('data').getAttribute('data-value');
    const horario = document.getElementById('horario').getAttribute('data-value');
    const pessoas = document.getElementById('pessoas').getAttribute('data-value');
    const querBolo = document.getElementById('querBolo').getAttribute('data-value');

    if (!dataRaw) return;

    const d = new Date(dataRaw + 'T12:00:00');
    const dataBr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Save to backend
    try {
        const itemData = {
            type: 'reservation',
            date: dataRaw,
            qtyPeople: parseInt(pessoas),
            phone: `55${whatsapp.replace(/\D/g, '')}`,
            name: nome,
            time: horario,
            isBirthday: querBolo === 'sim',
            courtesy: (querBolo === 'sim') ? (document.getElementById('sabor').getAttribute('data-value') || "Não especificado") : null,
            observations: `Pelo link público. Bolo: ${querBolo === 'sim' ? 'Sim' : 'Não'}.`,
            status: 'Pendente'
        };

        const response = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            console.error('Falha ao salvar no servidor');
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }

    let texto = `*RESERVA - NOSSA CARNE*\n\n*Cliente:* ${nome}\n*WhatsApp:* ${whatsapp}\n*Data:* ${dataBr}\n*Hora:* ${horario}\n*Pessoas:* ${pessoas}\n_Ciente da taxa de rolha (R$40)._`;

    if (querBolo === 'sim') {
        const kg = document.getElementById('kg').value;
        const sabor = document.getElementById('sabor').getAttribute('data-value') || "Não especificado";
        let valorKg = settings ? settings.pix.pricePerKg : 95.00;
        const excedente = Math.max(0, (kg - 1) * valorKg);

        texto += `\n\n*BOLO CORTESIA*\n*Sabor:* ${sabor}\n*Peso:* ${kg}kg`;
        if (excedente > 0) texto += `\n*Excedente:* R$ ${excedente.toFixed(2)}`;
    }

    const TELEFONE_CONTATO = (settings && settings.whatsappNumber) ? settings.whatsappNumber : "5511967105333";
    window.open(`https://wa.me/${TELEFONE_CONTATO}?text=${encodeURIComponent(texto)}`, '_blank');
}

function copiarPix() {
    const pixCode = document.getElementById('pixCopiaCola').innerText;
    navigator.clipboard.writeText(pixCode).then(() => {
        const btn = document.querySelector('button[onclick="copiarPix()"]');
        const originalText = btn.innerText;
        btn.innerText = "COPIADO! ✅";
        btn.style.background = "#27ae60";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#f39c12";
        }, 2000);
    }).catch(err => {
        alert("Erro ao copiar código PIX. Tente selecionar e copiar manualmente.");
    });
}
