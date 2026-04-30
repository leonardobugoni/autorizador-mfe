/* ===== Dashboard Page ===== */
const DashboardPage = (() => {
    function getMenuItems() {
        return [
            { icon: 'home', label: 'Inicio', hash: '#dashboard', active: true },
            { icon: 'transfer', label: 'Transferencias', hash: '#transfer' },
            { icon: 'pix', label: 'Pix', hash: '#coming-soon' },
            { icon: 'payment', label: 'Pagamentos', hash: '#coming-soon' },
            { icon: 'loan', label: 'Emprestimos', hash: '#coming-soon' },
            { icon: 'invest', label: 'Investimentos', hash: '#coming-soon' },
            { icon: 'card', label: 'Cartoes', hash: '#coming-soon' },
            { icon: 'shield', label: 'Seguros', hash: '#coming-soon' },
            { icon: 'statement', label: 'Extrato', hash: '#statement' }
        ];
    }

    function getIcon(name) {
        const icons = {
            home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
            transfer: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16l-4-4 4-4"/><path d="M3 12h18"/><path d="M17 8l4 4-4 4"/></svg>',
            pix: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
            payment: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M12 8v12"/><path d="M8 8v12"/><path d="M16 8v12"/><rect x="3" y="4" width="18" height="16" rx="1" fill="none"/></svg>',
            loan: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-4a2 2 0 000 4h2a2 2 0 010 4H8"/><path d="M12 6v2m0 8v2"/></svg>',
            invest: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
            card: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
            shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            statement: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>',
            logout: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
            menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
        };
        return icons[name] || '';
    }

    function renderLayout(contentHTML) {
        const nome = Auth.getNomeTitular() || 'Usuario';
        const conta = Auth.getNumeroConta() || '---';
        const currentHash = window.location.hash || '#dashboard';
        const menuItems = getMenuItems();

        const menuHTML = menuItems.map(item => {
            const isActive = item.hash === currentHash;
            return `
                <li class="sidebar__item ${isActive ? 'sidebar__item--active' : ''}" data-hash="${item.hash}">
                    <span class="sidebar__icon">${getIcon(item.icon)}</span>
                    <span class="sidebar__label">${item.label}</span>
                </li>
            `;
        }).join('');

        return `
            <div class="layout">
                <header class="header">
                    <div class="header__left">
                        <button class="header__menu-btn" id="menuToggle">${getIcon('menu')}</button>
                        <div class="header__logo">
                            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="10" fill="#FF6200"/>
                                <path d="M14 34V18L24 10L34 18V34H28V24H20V34H14Z" fill="white"/>
                            </svg>
                            <span>Autorizador Financeiro</span>
                        </div>
                    </div>
                    <div class="header__right">
                        <div class="header__user">
                            <div class="header__avatar">${nome.charAt(0).toUpperCase()}</div>
                            <div class="header__user-info">
                                <span class="header__user-name">${nome}</span>
                                <span class="header__user-conta">Conta: ${conta}</span>
                            </div>
                        </div>
                        <button class="header__logout" id="logoutBtn" title="Sair">
                            ${getIcon('logout')}
                        </button>
                    </div>
                </header>
                <div class="layout__body">
                    <aside class="sidebar" id="sidebar">
                        <nav class="sidebar__nav">
                            <ul class="sidebar__menu">
                                ${menuHTML}
                            </ul>
                        </nav>
                    </aside>
                    <main class="main">
                        ${contentHTML}
                    </main>
                </div>
                <footer class="footer">
                    <p>Autorizador Financeiro &copy; ${new Date().getFullYear()} - Ambiente de Demonstracao</p>
                </footer>
            </div>
        `;
    }

    async function render() {
        const nome = Auth.getNomeTitular() || 'Usuario';
        const contentHTML = `
            <div class="dashboard">
                <h2 class="dashboard__greeting">Ola, ${nome}!</h2>
                <p class="dashboard__subtitle">Bem-vindo ao seu painel financeiro</p>
                <div class="dashboard__cards">
                    <div class="dashboard__card dashboard__card--saldo" id="saldoCard">
                        <div class="dashboard__card-header">
                            <span class="dashboard__card-label">Saldo Disponivel</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M16 8h-4a2 2 0 000 4h2a2 2 0 010 4H8"/>
                                <path d="M12 6v2m0 8v2"/>
                            </svg>
                        </div>
                        <div class="dashboard__card-value" id="saldoValue">
                            <div class="spinner spinner--dark spinner--lg"></div>
                        </div>
                    </div>
                    <div class="dashboard__card dashboard__card--info">
                        <div class="dashboard__card-header">
                            <span class="dashboard__card-label">Acoes Rapidas</span>
                        </div>
                        <div class="dashboard__quick-actions">
                            <button class="dashboard__action-btn" data-hash="#transfer">
                                ${DashboardPage.getIcon('transfer')}
                                <span>Transferir</span>
                            </button>
                            <button class="dashboard__action-btn" data-hash="#statement">
                                ${DashboardPage.getIcon('statement')}
                                <span>Extrato</span>
                            </button>
                            <button class="dashboard__action-btn" data-hash="#coming-soon">
                                ${DashboardPage.getIcon('pix')}
                                <span>Pix</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return renderLayout(contentHTML);
    }

    async function afterRender() {
        bindLayoutEvents();
        await loadSaldo();
    }

    function bindLayoutEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.logout());
        }

        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('sidebar--open');
            });
        }

        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.addEventListener('click', () => {
                const hash = item.getAttribute('data-hash');
                if (sidebar) sidebar.classList.remove('sidebar--open');
                App.navigate(hash);
            });
        });

        document.querySelectorAll('.dashboard__action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const hash = btn.getAttribute('data-hash');
                App.navigate(hash);
            });
        });
    }

    async function loadSaldo() {
        const saldoEl = document.getElementById('saldoValue');
        if (!saldoEl) return;

        try {
            const numeroConta = Auth.getNumeroConta();
            const data = await Api.getSaldo(numeroConta);
            const saldo = typeof data === 'object' ? (data.saldo ?? data.valor ?? 0) : data;
            saldoEl.textContent = App.formatCurrency(saldo);
        } catch {
            saldoEl.textContent = 'R$ ---';
        }
    }

    return {
        render,
        afterRender,
        renderLayout,
        bindLayoutEvents,
        getIcon,
        getMenuItems
    };
})();
