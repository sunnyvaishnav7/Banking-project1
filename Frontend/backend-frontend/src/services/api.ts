import { User, BankAccount, Transaction, TransactionHistoryResponse, CurrencyType } from '../types';

const API_BASE_URL = '/api';

// Helper to retrieve token
export const getToken = (): string | null => {
    return localStorage.getItem('apex_token');
};

export const setToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('apex_token', token);
    } else {
        localStorage.removeItem('apex_token');
    }
};

// Check if demo sandbox mode is forced or active
export const isDemoMode = (): boolean => {
    return localStorage.getItem('apex_demo_mode') === 'true';
};

export const setDemoMode = (val: boolean) => {
    localStorage.setItem('apex_demo_mode', val ? 'true' : 'false');
};

// Custom Fetch Wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.message || `Request failed with status ${response.status}`;
            const error: any = new Error(errorMsg);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data as T;
    } catch (err: any) {
        // If connection fails and not in demo mode, throw or allow caller to handle
        throw err;
    }
}

// Check if backend is alive
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${getToken() || ''}`
            }
        });
        return res.status !== 502 && res.status !== 504 && res.status !== 404;
    } catch {
        return false;
    }
};

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
    register: async (name: string, email: string, password: string):Promise<{ user: User; token?: string }> => {
        return request<{ user: User; token?: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    },

    login: async (email: string, password: string): Promise<{ user: User; token?: string }> => {
        return request<{ user: User; token?: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getMe: async (): Promise<{ user: User }> => {
        return request<{ user: User }>('/auth/me', {
            method: 'GET',
        });
    },

    logout: async (): Promise<{ message: string }> => {
        return request<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    },
};

// ==========================================
// ACCOUNTS API
// ==========================================
export const accountsApi = {
    createAccount: async (currency: CurrencyType = 'INR'): Promise<{ message: string; account: BankAccount }> => {
        return request<{ message: string; account: BankAccount }>('/accounts', {
            method: 'POST',
            body: JSON.stringify({ currency }),
        });
    },

    getAccounts: async (): Promise<{ accounts: BankAccount[] }> => {
        return request<{ accounts: BankAccount[] }>('/accounts', {
            method: 'GET',
        });
    },

    getBalance: async (accountId: string): Promise<{ accountId: string; balance: number }> => {
        return request<{ accountId: string; balance: number }>(`/accounts/balance/${accountId}`, {
            method: 'GET',
        });
    },
};

// ==========================================
// TRANSACTIONS API
// ==========================================
export const transactionsApi = {
    createTransaction: async (data: {
        fromAccount: string;
        toAccount: string;
        amount: number;
        idempotencyKey: string;
    }): Promise<{ message: string; transaction: Transaction }> => {
        return request<{ message: string; transaction: Transaction }>('/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getTransactionHistory: async (page = 1, limit = 20): Promise<TransactionHistoryResponse> => {
        return request<TransactionHistoryResponse>(`/transactions?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    },

    createInitialFunds: async (data: {
        toAccount: string;
        amount: number;
        idempotencyKey: string;
    }): Promise<{ message: string; transaction: Transaction }> => {
        return request<{ message: string; transaction: Transaction }>('/transactions/system/initial-funds', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
