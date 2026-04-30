/* ===== Transfer Page ===== */
const TransferPage = (() => {
    async function render() {
        const contentHTML = `
            <div class="transfer">
                <h2 class="transfer__title">Nova Transferencia</h2>
                <p class="transfer__subtitle">Preencha os dados abaixo para realizar a transferencia</p>
                <div class="transfer__card">
                    <form id="transferForm" class="transfer__form" novalidate>
                        <div class="form-group">
                            <label for="contaDestino">Conta Destino</label>
                            <input type="text" id="contaDestino" placeholder="Numero da conta destino" required>
                            <span class="error-text hidden" id="contaDestinoError"></span>
                        </div>
                        <div class="form-group">
                            <label for="valorTransfer">Valor (R$)</label>
                            <input type="text" id="valorTransfer" placeholder="0,00" required>
                            <span class="error-text hidden" id="valorError"></span>
                        </div>
                        <div class="form-group">
                            <label for="descricaoTransfer">Descricao (opcional)</label>
                            <textarea id="descricaoTransfer" rows="3" placeholder="Informe uma descricao para a transferencia"></textarea>
                        </div>
                        <button type="submit" class="btn btn--primary btn--block" id="transferBtn">
                            <span id="transferBtnText">Transferir</span>
                            <div id="transferSpinner" class="spinner hidden"></div>
                        </button>
                    </form>
                </div>
            </div>
        `;
        return DashboardPage.renderLayout(contentHTML);
    }

    async function afterRender() {
        DashboardPage.bindLayoutEvents();
        highlightMenu();
        setupMoneyMask();
        setupForm();
    }

    function highlightMenu() {
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.remove('sidebar__item--active');
            if (item.getAttribute('data-hash') === '#transfer') {
                item.classList.add('sidebar__item--active');
            }
        });
    }

    function setupMoneyMask() {
        const input = document.getElementById('valorTransfer');
        if (!input) return;

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (!value) {
                e.target.value = '';
                return;
            }
            value = (parseInt(value, 10) / 100).toFixed(2);
            e.target.value = value.replace('.', ',');
        });
    }

    function parseMoneyValue(str) {
        if (!str) return 0;
        return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    }

    function validate() {
        let valid = true;
        const contaDestino = document.getElementById('contaDestino');
        const valorInput = document.getElementById('valorTransfer');
        const contaDestinoError = document.getElementById('contaDestinoError');
        const valorError = document.getElementById('valorError');

        contaDestinoError.classList.add('hidden');
        valorError.classList.add('hidden');
        contaDestino.classList.remove('error');
        valorInput.classList.remove('error');

        if (!contaDestino.value.trim()) {
            contaDestinoError.textContent = 'Informe a conta destino';
            contaDestinoError.classList.remove('hidden');
            contaDestino.classList.add('error');
            valid = false;
        } else if (contaDestino.value.trim() === Auth.getNumeroConta()) {
            contaDestinoError.textContent = 'Nao e possivel transferir para a propria conta';
            contaDestinoError.classList.remove('hidden');
            contaDestino.classList.add('error');
            valid = false;
        }

        const valor = parseMoneyValue(valorInput.value);
        if (!valorInput.value.trim() || valor <= 0) {
            valorError.textContent = 'O valor deve ser maior que zero';
            valorError.classList.remove('hidden');
            valorInput.classList.add('error');
            valid = false;
        } else {
            const parts = valor.toString().split('.');
            if (parts[1] && parts[1].length > 2) {
                valorError.textContent = 'O valor deve ter no maximo 2 casas decimais';
                valorError.classList.remove('hidden');
                valorInput.classList.add('error');
                valid = false;
            }
        }

        return valid;
    }

    function setupForm() {
        const form = document.getElementById('transferForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validate()) return;

            const btn = document.getElementById('transferBtn');
            const btnText = document.getElementById('transferBtnText');
            const spinner = document.getElementById('transferSpinner');

            const contaOrigem = Auth.getNumeroConta();
            const contaDestino = document.getElementById('contaDestino').value.trim();
            const valor = parseMoneyValue(document.getElementById('valorTransfer').value);
            const descricao = document.getElementById('descricaoTransfer').value.trim();
            const idempotencyKey = App.generateUUID();

            btn.disabled = true;
            btnText.textContent = 'Processando...';
            spinner.classList.remove('hidden');

            try {
                await Api.transferencia(contaOrigem, contaDestino, valor, descricao, idempotencyKey);
                showSuccessModal(contaDestino, valor, descricao);
            } catch (error) {
                App.showToast(error.message || 'Erro ao realizar transferencia', 'error');
            } finally {
                btn.disabled = false;
                btnText.textContent = 'Transferir';
                spinner.classList.add('hidden');
            }
        });
    }

    function showSuccessModal(contaDestino, valor, descricao) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal__icon modal__icon--success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>
                <h3 class="modal__title">Transferencia Realizada!</h3>
                <div class="modal__details">
                    <div class="modal__details-row">
                        <span class="modal__details-label">Conta destino</span>
                        <span class="modal__details-value">${contaDestino}</span>
                    </div>
                    <div class="modal__details-row">
                        <span class="modal__details-label">Valor</span>
                        <span class="modal__details-value">${App.formatCurrency(valor)}</span>
                    </div>
                    ${descricao ? `
                    <div class="modal__details-row">
                        <span class="modal__details-label">Descricao</span>
                        <span class="modal__details-value">${descricao}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="modal__actions">
                    <button class="btn btn--primary" id="novaTransferenciaBtn">Nova Transferencia</button>
                    <button class="btn btn--outline" id="voltarDashboardBtn">Voltar ao Inicio</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('novaTransferenciaBtn').addEventListener('click', () => {
            overlay.remove();
            document.getElementById('transferForm').reset();
        });

        document.getElementById('voltarDashboardBtn').addEventListener('click', () => {
            overlay.remove();
            App.navigate('#dashboard');
        });
    }

    return { render, afterRender };
})();
