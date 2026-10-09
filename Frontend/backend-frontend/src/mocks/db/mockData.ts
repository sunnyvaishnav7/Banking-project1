/**
 * In-Memory Stateful Mock Database for Apex Banking
 * Stores all monetary values in integer cents (cents/paise).
 */

export interface MockUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    tier: string;
    pin: string; // '1234'
    isBiometricEnabled: boolean;
    is2FAEnabled: boolean;
    dailyTransferLimitCents: number; // $10,000.00 -> 1000000
    dailyTransferredTodayCents: number;
}

export interface MockAccount {
    id: string;
    name: string;
    currency: 'USD' | 'EUR' | 'GBP' | 'INR';
    balanceCents: number;
    accountNumber: string;
    routingNumber: string;
    type: 'Checking' | 'Savings' | 'Treasury';
    apy?: string;
    isPrimary?: boolean;
}

export interface MockCard {
    id: string;
    accountId: string;
    type: 'Mastercard' | 'Visa';
    tier: string;
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    isFrozen: boolean;
    spendingLimitCents: number;
    monthlySpentCents: number;
    atmWithdrawalLimitCents: number;
    onlinePurchasesEnabled: boolean;
    internationalTransactionsEnabled: boolean;
}

export interface MockTransaction {
    id: string;
    accountId: string;
    fromAccount: string;
    toAccount: string;
    amountCents: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'INR';
    direction: 'INCOMING' | 'OUTGOING';
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    category: 'Shopping' | 'Salary' | 'Utilities' | 'Dining' | 'Investment' | 'Transfers';
    payeeName: string;
    payeeAvatar?: string;
    note?: string;
    idempotencyKey: string;
    createdAt: string;
    refNumber: string;
    feeCents: number;
}

export interface MockPayee {
    id: string;
    name: string;
    handle: string;
    accountNumber: string;
    routingNumber: string;
    avatar: string;
    bankName: string;
    isFavorite: boolean;
}

export interface MockBiller {
    id: string;
    name: string;
    category: 'Utilities' | 'Telecom' | 'Cloud & Hosting' | 'Insurance';
    amountDueCents: number;
    dueDate: string;
    isAutoPay: boolean;
    icon: string;
}

export interface MockNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'transaction' | 'security' | 'card' | 'system';
    isRead: boolean;
    link?: string;
}

// Initial Database State
export const initialUser: MockUser = {
    id: 'usr_apex_9824',
    name: 'Alexander Wright',
    email: 'alex.wright@apexbank.io',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tier: 'Apex Premier Member',
    pin: '1234',
    isBiometricEnabled: true,
    is2FAEnabled: true,
    dailyTransferLimitCents: 1000000, // $10,000.00
    dailyTransferredTodayCents: 15000, // $150.00
};

export const initialAccounts: MockAccount[] = [
    {
        id: 'acc_checking_01',
        name: 'Primary Checking Account',
        currency: 'USD',
        balanceCents: 1843000, // $18,430.00
        accountNumber: '4092 8812 3901',
        routingNumber: 'APEX04291',
        type: 'Checking',
        isPrimary: true,
    },
    {
        id: 'acc_savings_02',
        name: 'High-Yield Savings Vault',
        currency: 'USD',
        balanceCents: 642075, // $6,420.75
        accountNumber: '8821 7734 1092',
        routingNumber: 'APEX04291',
        type: 'Savings',
        apy: '7.2% APY',
    },
    {
        id: 'acc_euro_03',
        name: 'Euro Global Treasury',
        currency: 'EUR',
        balanceCents: 325000, // €3,250.00
        accountNumber: '1109 4432 9901',
        routingNumber: 'SEPA-APEX01',
        type: 'Treasury',
    },
    {
        id: 'acc_gbp_04',
        name: 'Sterling Vault Hub',
        currency: 'GBP',
        balanceCents: 185000, // £1,850.00
        accountNumber: '6620 5519 8812',
        routingNumber: 'FPS-APEX88',
        type: 'Treasury',
    }
];

export const initialCards: MockCard[] = [
    {
        id: 'card_01',
        accountId: 'acc_checking_01',
        type: 'Mastercard',
        tier: 'Cyber Blue Titanium',
        cardNumber: '4291 8820 9912 4431',
        cardHolder: 'ALEXANDER WRIGHT',
        expiry: '09/29',
        cvv: '842',
        isFrozen: false,
        spendingLimitCents: 500000, // $5,000.00
        monthlySpentCents: 142025, // $1,420.25
        atmWithdrawalLimitCents: 100000, // $1,000.00
        onlinePurchasesEnabled: true,
        internationalTransactionsEnabled: true,
    },
    {
        id: 'card_02',
        accountId: 'acc_savings_02',
        type: 'Visa',
        tier: 'Global Travel Platinum',
        cardNumber: '5512 3901 2284 1098',
        cardHolder: 'ALEXANDER WRIGHT',
        expiry: '11/30',
        cvv: '319',
        isFrozen: false,
        spendingLimitCents: 1000000, // $10,000.00
        monthlySpentCents: 285000, // $2,850.00
        atmWithdrawalLimitCents: 200000, // $2,000.00
        onlinePurchasesEnabled: true,
        internationalTransactionsEnabled: true,
    }
];

export const initialPayees: MockPayee[] = [
    {
        id: 'payee_01',
        name: 'Sarah Jenkins',
        handle: 'sarah.j@apex',
        accountNumber: '•••• 9921',
        routingNumber: 'APEX04291',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        bankName: 'Apex Core Bank',
        isFavorite: true,
    },
    {
        id: 'payee_02',
        name: 'Sam Richardson',
        handle: 'sam.r@apex',
        accountNumber: '•••• 4492',
        routingNumber: 'APEX04291',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        bankName: 'Apex Core Bank',
        isFavorite: true,
    },
    {
        id: 'payee_03',
        name: 'Elena Rostova',
        handle: 'elena@apex',
        accountNumber: '•••• 1102',
        routingNumber: 'CHASE091',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
        bankName: 'JPMorgan Chase',
        isFavorite: false,
    },
    {
        id: 'payee_04',
        name: 'Marcus Vance',
        handle: 'marcus.v@apex',
        accountNumber: '•••• 8834',
        routingNumber: 'BOFA021',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        bankName: 'Bank of America',
        isFavorite: false,
    }
];

export const initialBillers: MockBiller[] = [
    {
        id: 'biller_01',
        name: 'ConEdison Electricity',
        category: 'Utilities',
        amountDueCents: 8450, // $84.50
        dueDate: 'In 3 days',
        isAutoPay: true,
        icon: 'Zap',
    },
    {
        id: 'biller_02',
        name: 'Verizon Wireless 5G',
        category: 'Telecom',
        amountDueCents: 12000, // $120.00
        dueDate: 'In 5 days',
        isAutoPay: true,
        icon: 'Smartphone',
    },
    {
        id: 'biller_03',
        name: 'AWS Cloud Services',
        category: 'Cloud & Hosting',
        amountDueCents: 45000, // $450.00
        dueDate: 'Oct 20, 2026',
        isAutoPay: false,
        icon: 'Server',
    },
    {
        id: 'biller_04',
        name: 'MetLife Health Insurance',
        category: 'Insurance',
        amountDueCents: 21000, // $210.00
        dueDate: 'Oct 28, 2026',
        isAutoPay: true,
        icon: 'Shield',
    }
];

export const initialTransactions: MockTransaction[] = [
    {
        id: 'tx_01',
        accountId: 'acc_checking_01',
        fromAccount: '•••• 8812',
        toAccount: '•••• 9921',
        amountCents: 19900, // $199.00
        currency: 'USD',
        direction: 'OUTGOING',
        status: 'COMPLETED',
        category: 'Shopping',
        payeeName: 'Apple Store 5th Ave NYC',
        note: 'AirPods Pro Gen 2',
        idempotencyKey: 'idem_apple_01',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        refNumber: 'APEX_TX_98124',
        feeCents: 0,
    },
    {
        id: 'tx_02',
        accountId: 'acc_checking_01',
        fromAccount: '•••• 4492',
        toAccount: '•••• 8812',
        amountCents: 15000, // $150.00
        currency: 'USD',
        direction: 'OUTGOING',
        status: 'COMPLETED',
        category: 'Transfers',
        payeeName: 'Transfer to Sam Richardson',
        note: 'Dinner & Concert Tickets',
        idempotencyKey: 'idem_sam_02',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        refNumber: 'APEX_TX_98125',
        feeCents: 0,
    },
    {
        id: 'tx_03',
        accountId: 'acc_checking_01',
        fromAccount: 'SYSTEM_PAYROLL',
        toAccount: '•••• 8812',
        amountCents: 485000, // $4,850.00
        currency: 'USD',
        direction: 'INCOMING',
        status: 'COMPLETED',
        category: 'Salary',
        payeeName: 'Apex Technologies Payroll',
        note: 'Bi-weekly Direct Deposit',
        idempotencyKey: 'idem_salary_03',
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        refNumber: 'APEX_TX_98126',
        feeCents: 0,
    },
    {
        id: 'tx_04',
        accountId: 'acc_checking_01',
        fromAccount: '•••• 8812',
        toAccount: 'CONED_VAULT',
        amountCents: 8450, // $84.50
        currency: 'USD',
        direction: 'OUTGOING',
        status: 'COMPLETED',
        category: 'Utilities',
        payeeName: 'ConEdison Electricity',
        note: 'Residential Power Statement',
        idempotencyKey: 'idem_coned_04',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        refNumber: 'APEX_TX_98127',
        feeCents: 0,
    },
    {
        id: 'tx_05',
        accountId: 'acc_checking_01',
        fromAccount: '•••• 8812',
        toAccount: 'BLUE_BOTTLE',
        amountCents: 675, // $6.75
        currency: 'USD',
        direction: 'OUTGOING',
        status: 'COMPLETED',
        category: 'Dining',
        payeeName: 'Blue Bottle Coffee Roasters',
        note: 'Iced Oat Latte',
        idempotencyKey: 'idem_coffee_05',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        refNumber: 'APEX_TX_98128',
        feeCents: 0,
    },
    {
        id: 'tx_06',
        accountId: 'acc_savings_02',
        fromAccount: 'VANGUARD_DIV',
        toAccount: '•••• 7734',
        amountCents: 22000, // $220.00
        currency: 'USD',
        direction: 'INCOMING',
        status: 'COMPLETED',
        category: 'Investment',
        payeeName: 'Vanguard Dividend Distribution',
        note: 'VTI Quarterly Dividend',
        idempotencyKey: 'idem_div_06',
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
        refNumber: 'APEX_TX_98129',
        feeCents: 0,
    }
];

export const initialNotifications: MockNotification[] = [
    {
        id: 'notif_01',
        title: 'Salary Credited',
        message: '+$4,850.00 deposited into Primary Checking from Apex Payroll.',
        time: 'Yesterday',
        type: 'transaction',
        isRead: false,
    },
    {
        id: 'notif_02',
        title: 'Cyber Neon Mastercard Ready',
        message: 'Your Apple Pay virtual token is active for tap-to-pay.',
        time: '2d ago',
        type: 'card',
        isRead: false,
    },
    {
        id: 'notif_03',
        title: 'Security Biometric Check',
        message: 'Touch ID / Face ID hardware signature verified.',
        time: '4d ago',
        type: 'security',
        isRead: true,
    }
];
