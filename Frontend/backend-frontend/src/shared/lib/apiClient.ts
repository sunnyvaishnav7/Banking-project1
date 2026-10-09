import { mockBackend } from '../../mocks/handlers/mockApi';
import { memoryAuth } from './security';

/**
 * Unified API Client Layer
 * Any live banking backend can be swapped in here without altering any UI component.
 */
export const apiClient = {
    auth: {
        login: (emailOrPhone: string, pass: string) => mockBackend.login(emailOrPhone, pass),
        verifyOtp: (otp: string) => mockBackend.verifyOtp(otp),
        verifyPin: (pin: string) => mockBackend.verifyPin(pin),
        getMe: () => mockBackend.getMe(),
        logout: () => mockBackend.logout(),
    },
    accounts: {
        getAll: () => mockBackend.getAccounts(),
        open: (currency: 'USD' | 'EUR' | 'GBP' | 'INR', type: 'Checking' | 'Savings' | 'Treasury') =>
            mockBackend.openAccount(currency, type),
    },
    cards: {
        getAll: () => mockBackend.getCards(),
        toggleFreeze: (cardId: string) => mockBackend.toggleCardFreeze(cardId),
        updateLimits: (cardId: string, limits: { spendingLimitCents?: number; atmWithdrawalLimitCents?: number }) =>
            mockBackend.updateCardLimits(cardId, limits),
    },
    transfers: {
        getPayees: () => mockBackend.getPayees(),
        send: (data: {
            fromAccountId: string;
            toAccountOrPayeeId: string;
            amountCents: number;
            note?: string;
            idempotencyKey: string;
        }) => mockBackend.sendTransfer(data),
    },
    payments: {
        getBillers: () => mockBackend.getBillers(),
        payBill: (billerId: string, fromAccountId: string) => mockBackend.payBill(billerId, fromAccountId),
    },
    transactions: {
        getAll: (filter?: { type?: string; query?: string }) => mockBackend.getTransactions(filter),
    },
    notifications: {
        getAll: () => mockBackend.getNotifications(),
        markAllRead: () => mockBackend.markAllNotificationsRead(),
    },
};
