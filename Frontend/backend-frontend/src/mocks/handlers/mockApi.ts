import {
    MockUser,
    MockAccount,
    MockCard,
    MockTransaction,
    MockPayee,
    MockBiller,
    MockNotification,
    initialUser,
    initialAccounts,
    initialCards,
    initialPayees,
    initialBillers,
    initialTransactions,
    initialNotifications
} from '../db/mockData';
import { memoryAuth } from '../../shared/lib/security';

// Simulated Network Latency Helper
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Stateful In-Memory Storage
class MockBackendEngine {
    private user: MockUser = { ...initialUser };
    private accounts: MockAccount[] = [...initialAccounts];
    private cards: MockCard[] = [...initialCards];
    private payees: MockPayee[] = [...initialPayees];
    private billers: MockBiller[] = [...initialBillers];
    private transactions: MockTransaction[] = [...initialTransactions];
    private notifications: MockNotification[] = [...initialNotifications];
    private failedPinAttempts = 0;
    private isLockedOut = false;
    private lockoutUntil: number | null = null;
    private processedIdempotencyKeys = new Set<string>();

    // ----------------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------------
    async login(emailOrPhone: string, password: string):Promise<{ requiresOtp: boolean; message: string }> {
        await delay(300);
        if (!emailOrPhone.trim() || !password) {
            throw new Error('Email/phone and password are required.');
        }
        return {
            requiresOtp: true,
            message: 'A 6-digit OTP has been sent to your registered device.',
        };
    }

    async verifyOtp(otp: string): Promise<{ user: MockUser; token: string }> {
        await delay(250);
        if (otp !== '123456' && otp.length !== 6) {
            throw new Error('Invalid verification code. Use demo OTP: 123456');
        }
        const token = `jwt_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        memoryAuth.setToken(token);
        return {
            user: this.user,
            token,
        };
    }

    async verifyPin(pin: string): Promise<boolean> {
        await delay(200);
        if (this.isLockedOut && this.lockoutUntil && Date.now() < this.lockoutUntil) {
            const remainingMins = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
            throw new Error(`Account locked due to 3 failed attempts. Try again in ${remainingMins} minutes.`);
        }

        if (pin === this.user.pin) {
            this.failedPinAttempts = 0;
            this.isLockedOut = false;
            this.lockoutUntil = null;
            return true;
        }

        this.failedPinAttempts += 1;
        if (this.failedPinAttempts >= 3) {
            this.isLockedOut = true;
            this.lockoutUntil = Date.now() + 15 * 60 * 1000;
            throw new Error('Account locked due to 3 failed PIN attempts. Please wait 15 minutes or reset PIN.');
        }

        throw new Error(`Incorrect PIN. ${3 - this.failedPinAttempts} attempt(s) remaining.`);
    }

    async getMe(): Promise<MockUser> {
        await delay(150);
        return this.user;
    }

    async logout(): Promise<void> {
        await delay(100);
        memoryAuth.clear();
    }

    // ----------------------------------------------------
    // ACCOUNTS
    // ----------------------------------------------------
    async getAccounts(): Promise<MockAccount[]> {
        await delay(200);
        return [...this.accounts];
    }

    async openAccount(currency: 'USD' | 'EUR' | 'GBP' | 'INR', type: 'Checking' | 'Savings' | 'Treasury'): Promise<MockAccount> {
        await delay(350);
        const newAcc: MockAccount = {
            id: `acc_${Date.now()}`,
            name: `${currency} ${type} Account`,
            currency,
            balanceCents: 100000, // $1,000.00 initial credit
            accountNumber: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
            routingNumber: 'APEX04291',
            type,
            apy: type === 'Savings' ? '7.2% APY' : undefined,
        };
        this.accounts.push(newAcc);
        return newAcc;
    }

    // ----------------------------------------------------
    // CARDS
    // ----------------------------------------------------
    async getCards(): Promise<MockCard[]> {
        await delay(200);
        return [...this.cards];
    }

    async toggleCardFreeze(cardId: string): Promise<MockCard> {
        await delay(250);
        const card = this.cards.find((c) => c.id === cardId);
        if (!card) throw new Error('Card not found');
        card.isFrozen = !card.isFrozen;

        this.notifications.unshift({
            id: `notif_${Date.now()}`,
            title: card.isFrozen ? 'Card Temporarily Locked' : 'Card Unlocked',
            message: `${card.tier} (${card.cardNumber.slice(-4)}) has been ${card.isFrozen ? 'frozen for security.' : 'reactivated.'}`,
            time: 'Just now',
            type: 'card',
            isRead: false,
        });

        return { ...card };
    }

    async updateCardLimits(cardId: string, limits: { spendingLimitCents?: number; atmWithdrawalLimitCents?: number }): Promise<MockCard> {
        await delay(250);
        const card = this.cards.find((c) => c.id === cardId);
        if (!card) throw new Error('Card not found');
        if (limits.spendingLimitCents !== undefined) card.spendingLimitCents = limits.spendingLimitCents;
        if (limits.atmWithdrawalLimitCents !== undefined) card.atmWithdrawalLimitCents = limits.atmWithdrawalLimitCents;
        return { ...card };
    }

    // ----------------------------------------------------
    // TRANSFERS & PAYEES
    // ----------------------------------------------------
    async getPayees(): Promise<MockPayee[]> {
        await delay(150);
        return [...this.payees];
    }

    async sendTransfer(data: {
        fromAccountId: string;
        toAccountOrPayeeId: string;
        amountCents: number;
        note?: string;
        idempotencyKey: string;
    }): Promise<{ transaction: MockTransaction; newBalanceCents: number }> {
        await delay(450);

        // 1. Idempotency check
        if (this.processedIdempotencyKeys.has(data.idempotencyKey)) {
            const existing = this.transactions.find((t) => t.idempotencyKey === data.idempotencyKey);
            if (existing) {
                const src = this.accounts.find((a) => a.id === data.fromAccountId) || this.accounts[0];
                return { transaction: existing, newBalanceCents: src.balanceCents };
            }
        }

        // 2. Validate Source Account
        const sourceAcc = this.accounts.find((a) => a.id === data.fromAccountId) || this.accounts[0];
        if (sourceAcc.balanceCents < data.amountCents) {
            throw new Error(`Insufficient funds. Available: $${(sourceAcc.balanceCents / 100).toFixed(2)}.`);
        }

        // 3. Daily Limit Check
        if (this.user.dailyTransferredTodayCents + data.amountCents > this.user.dailyTransferLimitCents) {
            throw new Error(`Transfer exceeds daily limit of $${(this.user.dailyTransferLimitCents / 100).toFixed(2)}.`);
        }

        // 4. Find Payee Name
        const payee = this.payees.find((p) => p.id === data.toAccountOrPayeeId || p.accountNumber === data.toAccountOrPayeeId);
        const payeeName = payee ? payee.name : `Payee (${data.toAccountOrPayeeId})`;

        // 5. Debit Account & Commit
        sourceAcc.balanceCents -= data.amountCents;
        this.user.dailyTransferredTodayCents += data.amountCents;
        this.processedIdempotencyKeys.add(data.idempotencyKey);

        const newTx: MockTransaction = {
            id: `tx_${Date.now()}`,
            accountId: sourceAcc.id,
            fromAccount: sourceAcc.accountNumber,
            toAccount: payee ? payee.accountNumber : data.toAccountOrPayeeId,
            amountCents: data.amountCents,
            currency: sourceAcc.currency,
            direction: 'OUTGOING',
            status: 'COMPLETED',
            category: 'Transfers',
            payeeName: `Transfer to ${payeeName}`,
            note: data.note || 'Instant Apex Wire',
            idempotencyKey: data.idempotencyKey,
            createdAt: new Date().toISOString(),
            refNumber: `APEX_TX_${Math.floor(100000 + Math.random() * 900000)}`,
            feeCents: 0,
        };

        this.transactions.unshift(newTx);

        // Add Notification
        this.notifications.unshift({
            id: `notif_${Date.now()}`,
            title: 'Wire Transfer Executed',
            message: `Successfully transferred $${(data.amountCents / 100).toFixed(2)} to ${payeeName}.`,
            time: 'Just now',
            type: 'transaction',
            isRead: false,
        });

        return {
            transaction: newTx,
            newBalanceCents: sourceAcc.balanceCents,
        };
    }

    // ----------------------------------------------------
    // PAYMENTS & BILLERS
    // ----------------------------------------------------
    async getBillers(): Promise<MockBiller[]> {
        await delay(150);
        return [...this.billers];
    }

    async payBill(billerId: string, fromAccountId: string): Promise<MockTransaction> {
        await delay(400);
        const biller = this.billers.find((b) => b.id === billerId);
        if (!biller) throw new Error('Biller not found');

        const sourceAcc = this.accounts.find((a) => a.id === fromAccountId) || this.accounts[0];
        if (sourceAcc.balanceCents < biller.amountDueCents) {
            throw new Error(`Insufficient balance to pay bill of $${(biller.amountDueCents / 100).toFixed(2)}.`);
        }

        sourceAcc.balanceCents -= biller.amountDueCents;
        const newTx: MockTransaction = {
            id: `tx_${Date.now()}`,
            accountId: sourceAcc.id,
            fromAccount: sourceAcc.accountNumber,
            toAccount: biller.name,
            amountCents: biller.amountDueCents,
            currency: sourceAcc.currency,
            direction: 'OUTGOING',
            status: 'COMPLETED',
            category: 'Utilities',
            payeeName: biller.name,
            note: `Bill Payment - ${biller.category}`,
            idempotencyKey: `idem_bill_${Date.now()}`,
            createdAt: new Date().toISOString(),
            refNumber: `APEX_BILL_${Math.floor(100000 + Math.random() * 900000)}`,
            feeCents: 0,
        };

        this.transactions.unshift(newTx);
        return newTx;
    }

    // ----------------------------------------------------
    // TRANSACTIONS
    // ----------------------------------------------------
    async getTransactions(filter?: { type?: string; query?: string }): Promise<MockTransaction[]> {
        await delay(200);
        let list = [...this.transactions];

        if (filter?.type && filter.type !== 'All') {
            if (filter.type === 'Income') list = list.filter((t) => t.direction === 'INCOMING');
            if (filter.type === 'Expense') list = list.filter((t) => t.direction === 'OUTGOING' && t.category !== 'Transfers');
            if (filter.type === 'Transfers') list = list.filter((t) => t.category === 'Transfers');
        }

        if (filter?.query) {
            const q = filter.query.toLowerCase();
            list = list.filter((t) => t.payeeName.toLowerCase().includes(q) || t.refNumber.toLowerCase().includes(q));
        }

        return list;
    }

    // ----------------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------------
    async getNotifications(): Promise<MockNotification[]> {
        await delay(100);
        return [...this.notifications];
    }

    async markAllNotificationsRead(): Promise<void> {
        await delay(100);
        this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    }
}

export const mockBackend = new MockBackendEngine();
