import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, BankAccount, Transaction, CurrencyType } from '../types';
import { authApi, accountsApi, transactionsApi, setToken, getToken, isDemoMode, setDemoMode, checkBackendHealth } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
    user: User | null;
    accounts: BankAccount[];
    transactions: Transaction[];
    isLoading: boolean;
    isBackendOnline: boolean;
    isDemo: boolean;
    isPrivacyEnabled: boolean;
    theme: 'dark' | 'light';
    totalBalanceINR: number;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    demoLogin: () => void;
    logout: () => Promise<void>;
    toggleDemoMode: (enable: boolean) => void;
    togglePrivacy: () => void;
    toggleTheme: () => void;
    refreshAccounts: () => Promise<void>;
    refreshTransactions: () => Promise<void>;
    createAccount: (currency: CurrencyType) => Promise<BankAccount | null>;
    sendTransfer: (fromAccount: string, toAccount: string, amount: number) => Promise<boolean>;
    depositFunds: (toAccount: string, amount: number) => Promise<boolean>;
}

// Sample Mock Data for Instant Interactive Demo & Offline Mode
const DEMO_USER: User = {
    _id: 'usr_apex_9824',
    name: 'Alexander Wright',
    email: 'alex.wright@apexbank.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: new Date().toISOString()
};

const INITIAL_DEMO_ACCOUNTS: BankAccount[] = [
    {
        _id: '67a3f81e9b21a8d4e1011111',
        user: 'usr_apex_9824',
        currency: 'INR',
        status: 'ACTIVE',
        balance: 485920.50,
        accountNumber: '4092 8812 3901',
        accountType: 'Savings',
        createdAt: '2026-01-15T10:00:00.000Z'
    },
    {
        _id: '67a3f81e9b21a8d4e1022222',
        user: 'usr_apex_9824',
        currency: 'USD',
        status: 'ACTIVE',
        balance: 14250.00,
        accountNumber: '8821 7734 1092',
        accountType: 'Global Multi-Currency',
        createdAt: '2026-02-01T14:30:00.000Z'
    },
    {
        _id: '67a3f81e9b21a8d4e1033333',
        user: 'usr_apex_9824',
        currency: 'EUR',
        status: 'ACTIVE',
        balance: 6420.75,
        accountNumber: '1109 4432 9901',
        accountType: 'Checking',
        createdAt: '2026-02-20T09:15:00.000Z'
    }
];

const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
    {
        _id: 'tx_9812401',
        fromAccount: '67a3f81e9b21a8d4e1011111',
        toAccount: '67a3f81e9b21a8d4e1099999',
        amount: 3500.00,
        currency: 'INR',
        idempotencyKey: 'idemp_demo_01',
        status: 'COMPLETED',
        direction: 'OUTGOING',
        recipientName: 'Sarah Jenkins (Stripe UK)',
        category: 'Shopping',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        _id: 'tx_9812402',
        fromAccount: '67a3f81e9b21a8d4e1098888',
        toAccount: '67a3f81e9b21a8d4e1011111',
        amount: 85000.00,
        currency: 'INR',
        idempotencyKey: 'idemp_demo_02',
        status: 'COMPLETED',
        direction: 'INCOMING',
        senderName: 'Apex Technologies Payroll',
        category: 'Salary',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
        _id: 'tx_9812403',
        fromAccount: '67a3f81e9b21a8d4e1011111',
        toAccount: '67a3f81e9b21a8d4e1077777',
        amount: 1450.00,
        currency: 'INR',
        idempotencyKey: 'idemp_demo_03',
        status: 'COMPLETED',
        direction: 'OUTGOING',
        recipientName: 'AWS Cloud Services',
        category: 'Bills & Utilities',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
        _id: 'tx_9812404',
        fromAccount: '67a3f81e9b21a8d4e1022222',
        toAccount: '67a3f81e9b21a8d4e1066666',
        amount: 450.00,
        currency: 'USD',
        idempotencyKey: 'idemp_demo_04',
        status: 'COMPLETED',
        direction: 'OUTGOING',
        recipientName: 'Figma Subscription',
        category: 'Shopping',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
    },
    {
        _id: 'tx_9812405',
        fromAccount: '67a3f81e9b21a8d4e1055555',
        toAccount: '67a3f81e9b21a8d4e1022222',
        amount: 2200.00,
        currency: 'USD',
        idempotencyKey: 'idemp_demo_05',
        status: 'COMPLETED',
        direction: 'INCOMING',
        senderName: 'Vanguard Dividend Payout',
        category: 'Investment',
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
    }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
    const [isDemo, setIsDemo] = useState<boolean>(isDemoMode());
    const [isPrivacyEnabled, setIsPrivacyEnabled] = useState<boolean>(() => localStorage.getItem('apex_privacy') === 'true');
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('apex_theme') as 'dark' | 'light') || 'dark';
    });

    // Handle Theme on Body
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
        localStorage.setItem('apex_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const togglePrivacy = () => {
        setIsPrivacyEnabled((prev) => {
            const next = !prev;
            localStorage.setItem('apex_privacy', next ? 'true' : 'false');
            return next;
        });
    };

    // Calculate approximate Total Net Worth in INR
    const totalBalanceINR = accounts.reduce((sum, acc) => {
        const bal = acc.balance || 0;
        if (acc.currency === 'USD') return sum + bal * 86.5;
        if (acc.currency === 'EUR') return sum + bal * 92.0;
        if (acc.currency === 'GBP') return sum + bal * 109.0;
        return sum + bal;
    }, 0);

    // Refresh Accounts and attach latest balances
    const refreshAccounts = useCallback(async () => {
        if (isDemo) {
            return;
        }

        try {
            const res = await accountsApi.getAccounts();
            if (res && res.accounts) {
                // Fetch balances in parallel
                const detailedAccounts = await Promise.all(
                    res.accounts.map(async (acc) => {
                        try {
                            const balRes = await accountsApi.getBalance(acc._id);
                            return {
                                ...acc,
                                balance: balRes.balance,
                                accountNumber: acc.accountNumber || `•••• ${acc._id.slice(-4)}`
                            };
                        } catch {
                            return {
                                ...acc,
                                balance: acc.balance || 0,
                                accountNumber: `•••• ${acc._id.slice(-4)}`
                            };
                        }
                    })
                );
                setAccounts(detailedAccounts);
            }
        } catch (err: any) {
            console.error('Failed to fetch accounts:', err);
        }
    }, [isDemo]);

    // Refresh Transactions
    const refreshTransactions = useCallback(async () => {
        if (isDemo) {
            return;
        }

        try {
            const res = await transactionsApi.getTransactionHistory(1, 50);
            if (res && res.transactions) {
                setTransactions(res.transactions);
            }
        } catch (err: any) {
            console.error('Failed to fetch transactions:', err);
        }
    }, [isDemo]);

    // Initialize session & check health
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const online = await checkBackendHealth();
            setIsBackendOnline(online);

            const token = getToken();

            if (isDemo) {
                setUser(DEMO_USER);
                setAccounts(INITIAL_DEMO_ACCOUNTS);
                setTransactions(INITIAL_DEMO_TRANSACTIONS);
                setIsLoading(false);
                return;
            }

            if (token && online) {
                try {
                    const meRes = await authApi.getMe();
                    if (meRes?.user) {
                        setUser(meRes.user);
                        await refreshAccounts();
                        await refreshTransactions();
                    }
                } catch {
                    setToken(null);
                    setUser(null);
                }
            } else if (!online && !token) {
                // Default gracefully into demo preview so user sees full UI immediately
                setUser(DEMO_USER);
                setAccounts(INITIAL_DEMO_ACCOUNTS);
                setTransactions(INITIAL_DEMO_TRANSACTIONS);
                setIsDemo(true);
                setDemoMode(true);
            }

            setIsLoading(false);
        };

        init();
    }, [isDemo, refreshAccounts, refreshTransactions]);

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const res = await authApi.login(email, password);
            if (res.token) {
                setToken(res.token);
            }
            setUser(res.user);
            setIsDemo(false);
            setDemoMode(false);
            showToast(`Welcome back, ${res.user.name}!`, 'success', 'Authentication Successful');
            await refreshAccounts();
            await refreshTransactions();
            return true;
        } catch (err: any) {
            showToast(err.message || 'Login failed. Please check credentials.', 'error', 'Login Failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Register
    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const res = await authApi.register(name, email, password);
            if (res.token) {
                setToken(res.token);
            }
            setUser(res.user);
            setIsDemo(false);
            setDemoMode(false);
            showToast('Account created successfully!', 'success', 'Welcome to ApexBank');
            // Auto create first default INR account
            try {
                await accountsApi.createAccount('INR');
            } catch {}
            await refreshAccounts();
            return true;
        } catch (err: any) {
            showToast(err.message || 'Registration failed.', 'error', 'Registration Error');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Instant Demo Login
    const demoLogin = () => {
        setUser(DEMO_USER);
        setAccounts(INITIAL_DEMO_ACCOUNTS);
        setTransactions(INITIAL_DEMO_TRANSACTIONS);
        setIsDemo(true);
        setDemoMode(true);
        showToast('Logged into Interactive Sandbox Mode. Explore freely!', 'info', 'Sandbox Active');
    };

    // Logout
    const logout = async () => {
        try {
            if (!isDemo) {
                await authApi.logout();
            }
        } catch {}
        setToken(null);
        setUser(null);
        setAccounts([]);
        setTransactions([]);
        showToast('You have been signed out safely.', 'info', 'Signed Out');
    };

    const toggleDemoMode = (enable: boolean) => {
        setIsDemo(enable);
        setDemoMode(enable);
        if (enable) {
            setUser(DEMO_USER);
            setAccounts(INITIAL_DEMO_ACCOUNTS);
            setTransactions(INITIAL_DEMO_TRANSACTIONS);
            showToast('Switched to Demo Sandbox Mode.', 'info');
        } else {
            setUser(null);
            setAccounts([]);
            setTransactions([]);
            setToken(null);
            showToast('Switched to Live Backend Mode. Please sign in.', 'info');
        }
    };

    // Create Account
    const createAccount = async (currency: CurrencyType = 'INR'): Promise<BankAccount | null> => {
        if (isDemo) {
            const newAcc: BankAccount = {
                _id: '67a3f81e' + Math.random().toString(16).substring(2, 18),
                user: DEMO_USER._id,
                currency,
                status: 'ACTIVE',
                balance: 1000.00,
                accountNumber: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
                accountType: currency === 'INR' ? 'Savings' : 'Global Multi-Currency',
                createdAt: new Date().toISOString()
            };
            setAccounts((prev) => [newAcc, ...prev]);
            showToast(`New ${currency} account opened with initial bonus!`, 'success', 'Account Created');
            return newAcc;
        }

        try {
            const res = await accountsApi.createAccount(currency);
            showToast(`New ${currency} bank account created!`, 'success', 'Account Activated');
            await refreshAccounts();
            return res.account;
        } catch (err: any) {
            showToast(err.message || 'Could not create account', 'error');
            return null;
        }
    };

    // Send Transfer
    const sendTransfer = async (fromAccount: string, toAccount: string, amount: number): Promise<boolean> => {
        const idempotencyKey = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        if (isDemo) {
            // Find sender
            const srcIdx = accounts.findIndex((a) => a._id === fromAccount);
            if (srcIdx === -1) {
                showToast('Source account not found', 'error');
                return false;
            }
            if ((accounts[srcIdx].balance || 0) < amount) {
                showToast(`Insufficient balance! Available: ${accounts[srcIdx].balance} ${accounts[srcIdx].currency}`, 'error', 'Transfer Denied');
                return false;
            }

            // Deduct balance
            const updatedAccounts = [...accounts];
            updatedAccounts[srcIdx].balance = (updatedAccounts[srcIdx].balance || 0) - amount;
            setAccounts(updatedAccounts);

            const newTx: Transaction = {
                _id: `tx_${Date.now()}`,
                fromAccount,
                toAccount,
                amount,
                currency: updatedAccounts[srcIdx].currency,
                idempotencyKey,
                status: 'COMPLETED',
                direction: 'OUTGOING',
                recipientName: `Account •••• ${toAccount.slice(-4)}`,
                category: 'Transfer',
                createdAt: new Date().toISOString()
            };
            setTransactions((prev) => [newTx, ...prev]);
            showToast(`Successfully transferred ${amount} ${updatedAccounts[srcIdx].currency}`, 'success', 'Payment Sent');
            return true;
        }

        try {
            await transactionsApi.createTransaction({
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
            });
            showToast(`Transfer of ${amount} completed successfully!`, 'success', 'Transfer Completed');
            await refreshAccounts();
            await refreshTransactions();
            return true;
        } catch (err: any) {
            showToast(err.message || 'Transaction failed', 'error', 'Transfer Failed');
            return false;
        }
    };

    // Deposit Funds
    const depositFunds = async (toAccount: string, amount: number): Promise<boolean> => {
        const idempotencyKey = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        if (isDemo) {
            const accIdx = accounts.findIndex((a) => a._id === toAccount);
            if (accIdx !== -1) {
                const updated = [...accounts];
                updated[accIdx].balance = (updated[accIdx].balance || 0) + amount;
                setAccounts(updated);

                const newTx: Transaction = {
                    _id: `dep_${Date.now()}`,
                    fromAccount: 'system_vault',
                    toAccount,
                    amount,
                    currency: updated[accIdx].currency,
                    idempotencyKey,
                    status: 'COMPLETED',
                    direction: 'INCOMING',
                    senderName: 'Instant Top-Up / Vault Deposit',
                    category: 'Transfer',
                    createdAt: new Date().toISOString()
                };
                setTransactions((prev) => [newTx, ...prev]);
                showToast(`Deposited ${amount} ${updated[accIdx].currency} successfully!`, 'success', 'Funds Added');
                return true;
            }
            return false;
        }

        try {
            await transactionsApi.createInitialFunds({
                toAccount,
                amount,
                idempotencyKey
            });
            showToast(`Deposited ${amount} successfully!`, 'success', 'Deposit Complete');
            await refreshAccounts();
            await refreshTransactions();
            return true;
        } catch (err: any) {
            showToast(err.message || 'Deposit failed', 'error');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accounts,
                transactions,
                isLoading,
                isBackendOnline,
                isDemo,
                isPrivacyEnabled,
                theme,
                totalBalanceINR,
                login,
                register,
                demoLogin,
                logout,
                toggleDemoMode,
                togglePrivacy,
                toggleTheme,
                refreshAccounts,
                refreshTransactions,
                createAccount,
                sendTransfer,
                depositFunds,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
