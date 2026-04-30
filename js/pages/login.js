/* ===== Login Page ===== */
const LoginPage = (() => {
    function render() {
        return `
            <div class="login">
                <div class="login__card">
                    <div class="login__header">
                        <div class="login__logo">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="12" fill="#FF6200"/>
                                <path d="M14 34V18L24 10L34 18V34H28V24H20V34H14Z" fill="white"/>
                            </svg>
                        </div>
                        <h1 class="login__title">Autorizador Financeiro</h1>
                        <p class="login__subtitle">Acesse sua conta</p>
                    </div>
                    <form id="loginForm" class="login__form" novalidate>
                        <div class="form-group">
                            <label for="numeroConta">Numero da Conta</label>
                            <input type="text" id="numeroConta" placeholder="Digite o numero da conta" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <label for="senha">Senha</label>
                            <input type="password" id="senha" placeholder="Digite sua senha" required>
                        </div>
                        <div id="loginError" class="login__error hidden">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.75v4a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0z"/>
                            </svg>
                            <span id="loginErrorText">Conta ou senha invalida</span>
                        </div>
                        <button type="submit" class="btn btn--primary btn--block" id="loginBtn">
                            <span id="loginBtnText">Entrar</span>
                            <div id="loginSpinner" class="spinner hidden"></div>
                        </button>
                    </form>
                    <div class="login__footer">
                        <p>Ambiente de demonstracao</p>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('loginError');
        const errorText = document.getElementById('loginErrorText');
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const loginSpinner = document.getElementById('loginSpinner');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');

            const numeroConta = document.getElementById('numeroConta').value.trim();
            const senha = document.getElementById('senha').value;

            if (!numeroConta || !senha) {
                errorText.textContent = 'Preencha todos os campos';
                errorDiv.classList.remove('hidden');
                return;
            }

            loginBtn.disabled = true;
            loginBtnText.textContent = 'Entrando...';
            loginSpinner.classList.remove('hidden');

            try {
                const data = await Api.login(numeroConta, senha);
                Auth.salvarToken(data.token, data.nomeTitular, data.numeroConta);
                App.navigate('#dashboard');
            } catch (error) {
                errorText.textContent = error.status === 0
                    ? 'Servidor indisponivel. Tente novamente mais tarde.'
                    : 'Conta ou senha invalida';
                errorDiv.classList.remove('hidden');
            } finally {
                loginBtn.disabled = false;
                loginBtnText.textContent = 'Entrar';
                loginSpinner.classList.add('hidden');
            }
        });
    }

    return { render, afterRender };
})();
