const SEU_TELEFONE = "5511967105333";
const VALOR_KG = 95.00;

let dataSelecionada = "";
let dataAtualFoco = new Date();

document.addEventListener('DOMContentLoaded', () => {
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

        select.addEventListener('click', (e) => {
            const isShowing = select.nextElementSibling.classList.contains('show');
            fecharTodos();
            if (!isShowing) {
                select.classList.add('active');
                select.nextElementSibling.classList.add('show');
            }
            e.stopPropagation();
        });

        const options = select.nextElementSibling.querySelectorAll('.option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const val = opt.getAttribute('data-value');
                const text = opt.innerText;

                select.setAttribute('data-value', val);
                const span = select.querySelector('span');
                if (span) span.innerText = text;

                select.classList.remove('active');
                select.nextElementSibling.classList.remove('show');

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
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const d = new Date(ano, mes, dia);
        const diaSemana = d.getDay();
        const isDisabled = (diaSemana < 1 || diaSemana > 4) || (d < hoje);
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

// --- LÓGICA DE NEGÓCIO ---
function validarFluxo() {
    const nome = document.getElementById('nome').value.trim();
    const dataVal = document.getElementById('data').getAttribute('data-value');
    const horaVal = document.getElementById('horario').getAttribute('data-value');
    const pessoas = document.getElementById('pessoas').getAttribute('data-value');
    const querBolo = document.getElementById('querBolo').getAttribute('data-value');
    const btn = document.getElementById('btnEnviar');
    const painelBolo = document.getElementById('painelBolo');
    const kgInput = document.getElementById('kg');
    const kg = parseFloat(kgInput ? kgInput.value : 1) || 1;
    const divFinanceiro = document.getElementById('detalhesFinanceiros');

    let todosCamposPreenchidos = nome && dataVal && horaVal && pessoas;

    if (todosCamposPreenchidos) {
        btn.disabled = false;
        if (querBolo === 'sim') {
            painelBolo.style.display = 'block';
            painelBolo.className = 'secao-bolo modo-cortesia';
            let excedente = Math.max(0, (kg - 1) * VALOR_KG);
            if (excedente > 0) {
                const totalFormatado = excedente.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                const sinal = (excedente / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

                document.getElementById('valorTotal').innerText = totalFormatado;
                divFinanceiro.style.display = 'block';

                // Mostrar PIX para quilos extras (sinal de 50%)
                const pixPagamento = document.getElementById('pixPagamento');
                const valorInfo = document.getElementById('valorInfo');
                if (pixPagamento) pixPagamento.style.display = 'block';
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

function enviarWhatsApp() {
    const nome = document.getElementById('nome').value.trim();
    const dataRaw = document.getElementById('data').getAttribute('data-value');
    const horario = document.getElementById('horario').getAttribute('data-value');
    const pessoas = document.getElementById('pessoas').getAttribute('data-value');
    const querBolo = document.getElementById('querBolo').getAttribute('data-value');

    if (!dataRaw) return;

    const d = new Date(dataRaw + 'T12:00:00');
    const dataBr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let texto = `*RESERVA - NOSSA CARNE*\n\n👤 *Cliente:* ${nome}\n📅 *Data:* ${dataBr}\n⏰ *Hora:* ${horario}\n👥 *Pessoas:* ${pessoas}\n⚠️ _Ciente da taxa de rolha (R$40)._`;

    if (querBolo === 'sim') {
        const kg = document.getElementById('kg').value;
        const sabor = document.getElementById('sabor').getAttribute('data-value') || "Não especificado";
        const excedente = Math.max(0, (kg - 1) * VALOR_KG);

        texto += `\n\n🎂 *BOLO CORTESIA*\n🍰 *Sabor:* ${sabor}\n⚖️ *Peso:* ${kg}kg`;
        if (excedente > 0) texto += `\n💰 *Excedente:* R$ ${excedente.toFixed(2)}`;
    }

    window.open(`https://wa.me/${SEU_TELEFONE}?text=${encodeURIComponent(texto)}`, '_blank');
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
