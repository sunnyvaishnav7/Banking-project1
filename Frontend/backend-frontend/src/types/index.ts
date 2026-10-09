export interface User {
    _id: string;
    name: string;
    email: string;
    systemUser?: boolean;
    avatar?: string;
    createdAt?: string;
}

export type CurrencyType = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED';

export interface BankAccount {
    _id: string;
    user: string;
    currency: CurrencyType;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    balance?: number;
    balanceVersion?: number;
    accountNumber?: string;
    accountType?: 'Savings' | 'Checking' | 'Investment' | 'Global Multi-Currency';
    createdAt?: string;
    updatedAt?: string;
}

export interface Transaction {
    _id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    currency?: CurrencyType;
    idempotencyKey: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
    direction?: 'INCOMING' | 'OUTGOING';
    description?: string;
    category?: 'Transfer' | 'Shopping' | 'Salary' | 'Bills & Utilities' | 'Investment' | 'Food & Dining';
    createdAt: string;
    recipientName?: string;
    senderName?: string;
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface QuickContact {
    id: string;
    name: string;
    avatar: string;
    accountId: string;
    bankName: string;
    recentAmount?: number;
}

export interface VirtualCardData {
    id: string;
    accountId: string;
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    type: 'Visa' | 'Mastercard';
    cardTier: 'Black Obsidian' | 'Emerald Platinum' | 'Titanium Gold' | 'Cyber Neon';
    isFrozen: boolean;
    spendingLimit: number;
    monthlySpent: number;
}

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    timestamp: number;
}