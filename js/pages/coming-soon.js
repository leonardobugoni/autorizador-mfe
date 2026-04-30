/* ===== Coming Soon Page ===== */
const ComingSoonPage = (() => {
    async function render() {
        const contentHTML = `
            <div class="coming-soon">
                <div class="coming-soon__card">
                    <div class="coming-soon__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <h2 class="coming-soon__title">Em Breve</h2>
                    <p class="coming-soon__text">Esta funcionalidade sera liberada em breve.<br>Estamos trabalhando para trazer novidades!</p>
                    <button class="btn btn--primary" id="comingSoonBackBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        Voltar ao Inicio
                    </button>
                </div>
            </div>
        `;
        return DashboardPage.renderLayout(contentHTML);
    }

    async function afterRender() {
        DashboardPage.bindLayoutEvents();

        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.remove('sidebar__item--active');
        });

        const backBtn = document.getElementById('comingSoonBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => App.navigate('#dashboard'));
        }
    }

    return { render, afterRender };
})();
