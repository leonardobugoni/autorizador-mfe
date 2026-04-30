/* ===== Authentication Service ===== */
const Auth = (() => {
    const TOKEN_KEY = 'auth_token';
    const NOME_KEY = 'nome_titular';
    const CONTA_KEY = 'numero_conta';

    function salvarToken(token, nomeTitular, numeroConta) {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(NOME_KEY, nomeTitular);
        sessionStorage.setItem(CONTA_KEY, numeroConta);
    }

    function getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    function getNomeTitular() {
        return sessionStorage.getItem(NOME_KEY);
    }

    function getNumeroConta() {
        return sessionStorage.getItem(CONTA_KEY);
    }

    function isAuthenticated() {
        return !!getToken();
    }

    function logout() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(NOME_KEY);
        sessionStorage.removeItem(CONTA_KEY);
        window.location.hash = '#login';
    }

    return {
        salvarToken,
        getToken,
        getNomeTitular,
        getNumeroConta,
        isAuthenticated,
        logout
    };
})();
