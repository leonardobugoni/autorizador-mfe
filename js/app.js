/* ===== SPA Router ===== */
const App = (() => {
    const routes = {
        '#login': LoginPage,
        '#dashboard': DashboardPage,
        '#transfer': TransferPage,
        '#statement': StatementPage,
        '#coming-soon': ComingSoonPage
    };

    const publicRoutes = ['#login'];

    function navigate(hash) {
        window.location.hash = hash;
    }

    function getCurrentHash() {
        return window.location.hash || '#login';
    }

    async function render() {
        const hash = getCurrentHash();
        const app = document.getElementById('app');

        if (!publicRoutes.includes(hash) && !Auth.isAuthenticated()) {
            navigate('#login');
            return;
        }

        if (hash === '#login' && Auth.isAuthenticated()) {
            navigate('#dashboard');
            return;
        }

        const page = routes[hash];
        if (!page) {
            navigate('#dashboard');
            return;
        }

        document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
        app.innerHTML = '';
        app.className = 'page-enter';
        const content = await page.render();

        if (typeof content === 'string') {
            app.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            app.appendChild(content);
        }

        if (page.afterRender) {
            await page.afterRender();
        }

        void app.offsetWidth;
    }

    function init() {
        window.addEventListener('hashchange', render);

        if (!window.location.hash) {
            window.location.hash = '#login';
        } else {
            render();
        }
    }

    function showToast(message, type = 'info', duration = 3000) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('toast--visible');
        });

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    return {
        navigate,
        showToast,
        formatCurrency,
        formatDate,
        generateUUID,
        escapeHTML
    };
})();
