/* ===== API Service ===== */
const API_BASE_URL = 'http://localhost:8080/api';

const Api = (() => {
    async function request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: `Erro HTTP ${response.status}` };
                }
                const error = new Error(errorData.message || errorData.erro || `Erro ${response.status}`);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            if (error.status) throw error;
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                const networkError = new Error('Servidor indisponivel. Verifique sua conexao.');
                networkError.status = 0;
                throw networkError;
            }
            throw error;
        }
    }

    async function login(numeroConta, senha) {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ numeroConta, senha })
        });
    }

    async function getConta(numeroConta) {
        return request(`/contas/${numeroConta}`);
    }

    async function getSaldo(numeroConta) {
        return request(`/contas/${numeroConta}/saldo`);
    }

    async function debito(numeroConta, valor, descricao) {
        return request(`/contas/${numeroConta}/debito`, {
            method: 'POST',
            body: JSON.stringify({ valor, descricao })
        });
    }

    async function credito(numeroConta, valor, descricao) {
        return request(`/contas/${numeroConta}/credito`, {
            method: 'POST',
            body: JSON.stringify({ valor, descricao })
        });
    }

    async function transferencia(contaOrigem, contaDestino, valor, descricao, idempotencyKey) {
        return request('/transacoes/transferencia', {
            method: 'POST',
            body: JSON.stringify({
                contaOrigem,
                contaDestino,
                valor,
                descricao,
                idempotencyKey
            })
        });
    }

    async function getExtrato(numeroConta) {
        return request(`/contas/${numeroConta}/extrato`);
    }

    return {
        login,
        getConta,
        getSaldo,
        debito,
        credito,
        transferencia,
        getExtrato
    };
})();
