/* ===== Statement Page ===== */
const StatementPage = (() => {
    async function render() {
        const contentHTML = `
            <div class="statement">
                <h2 class="statement__title">Extrato</h2>
                <p class="statement__subtitle">Confira suas movimentacoes</p>
                <div class="statement__saldo-card" id="statementSaldo">
                    <div class="statement__saldo-label">Saldo Atual</div>
                    <div class="statement__saldo-value" id="statementSaldoValue">
                        <div class="spinner spinner--dark spinner--lg"></div>
                    </div>
                </div>
                <div class="statement__list" id="statementList">
                    <div class="loading-container">
                        <div class="spinner spinner--dark spinner--lg"></div>
                        <p>Carregando extrato...</p>
                    </div>
                </div>
            </div>
        `;
        return DashboardPage.renderLayout(contentHTML);
    }

    async function afterRender() {
        DashboardPage.bindLayoutEvents();
        highlightMenu();
        await Promise.all([loadSaldo(), loadExtrato()]);
    }

    function highlightMenu() {
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.remove('sidebar__item--active');
            if (item.getAttribute('data-hash') === '#statement') {
                item.classList.add('sidebar__item--active');
            }
        });
    }

    async function loadSaldo() {
        const el = document.getElementById('statementSaldoValue');
        if (!el) return;
        try {
            const numeroConta = Auth.getNumeroConta();
            const data = await Api.getSaldo(numeroConta);
            const saldo = typeof data === 'object' ? (data.saldo ?? data.valor ?? 0) : data;
            el.textContent = App.formatCurrency(saldo);
        } catch {
            el.textContent = 'R$ ---';
        }
    }

    async function loadExtrato() {
        const listEl = document.getElementById('statementList');
        if (!listEl) return;

        try {
            const numeroConta = Auth.getNumeroConta();
            const data = await Api.getExtrato(numeroConta);
            const lancamentos = Array.isArray(data) ? data : (data.lancamentos || data.transacoes || []);

            if (lancamentos.length === 0) {
                listEl.innerHTML = `
                    <div class="statement__empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <p>Nenhuma movimentacao encontrada</p>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = lancamentos.map(item => {
                const tipo = detectTipo(item);
                const isEntrada = tipo === 'entrada';
                const icon = isEntrada ? arrowUpIcon() : arrowDownIcon();
                const colorClass = isEntrada ? 'statement__item--entrada' : 'statement__item--saida';
                const valor = item.valor ?? item.amount ?? 0;
                const descricao = item.descricao || item.description || 'Movimentacao';
                const data = item.data || item.dataHora || item.createdAt || item.date || '';
                const saldoPosterior = item.saldoPosterior ?? item.saldoApos ?? null;

                return `
                    <div class="statement__item ${colorClass}">
                        <div class="statement__item-icon">${icon}</div>
                        <div class="statement__item-info">
                            <span class="statement__item-desc">${descricao}</span>
                            <span class="statement__item-date">${data ? App.formatDate(data) : '--'}</span>
                        </div>
                        <div class="statement__item-values">
                            <span class="statement__item-valor">${isEntrada ? '+' : '-'} ${App.formatCurrency(Math.abs(valor))}</span>
                            ${saldoPosterior !== null ? `<span class="statement__item-saldo">Saldo: ${App.formatCurrency(saldoPosterior)}</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } catch {
            listEl.innerHTML = `
                <div class="statement__empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>Erro ao carregar extrato. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }

    function detectTipo(item) {
        if (item.tipo) {
            const t = item.tipo.toLowerCase();
            if (t === 'credito' || t === 'entrada' || t === 'credit') return 'entrada';
            if (t === 'debito' || t === 'saida' || t === 'debit') return 'saida';
        }
        if (item.valor !== undefined) {
            return item.valor >= 0 ? 'entrada' : 'saida';
        }
        return 'saida';
    }

    function arrowUpIcon() {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    }

    function arrowDownIcon() {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    }

    return { render, afterRender };
})();
