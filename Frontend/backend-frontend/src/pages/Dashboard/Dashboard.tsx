import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VirtualCardData, Transaction } from '../../types';
import VirtualCard from '../../components/Cards/VirtualCard';
import ReceiptModal from '../../components/Modals/ReceiptModal';
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Send,
    PlusCircle,
    Building,
    RefreshCw,
    ShieldCheck,
    CreditCard,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Layers,
    DollarSign,
    Lock
} from 'lucide-react';
import './Dashboard.css';

interface DashboardProps {
    onOpenSendModal: () => void;
    onOpenDepositModal: () => void;
    onOpenNewAccountModal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    onOpenSendModal,
    onOpenDepositModal,
    onOpenNewAccountModal
}) => {
    const {
        user,
        accounts,
        transactions,
        totalBalanceINR,
        isPrivacyEnabled,
        refreshAccounts,
        refreshTransactions,
        isDemo
    } = useAuth();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<Transaction | null>(null);

    // Sample Virtual Card data
    const [cards, setCards] = useState<VirtualCardData[]>([
        {
            id: 'card_1',
            accountId: accounts[0]?._id || 'acc_primary',
            cardNumber: '4291 8820 9912 4431',
            cardHolder: (user?.name || 'Alexander Wright').toUpperCase(),
            expiry: '09/29',
            cvv: '842',
            type: 'Mastercard',
            cardTier: 'Black Obsidian',
            isFrozen: false,
            spendingLimit: 500000,
            monthlySpent: 42800,
        },
        {
            id: 'card_2',
            accountId: accounts[1]?._id || 'acc_sec',
            cardNumber: '5512 3901 2284 1098',
            cardHolder: (user?.name || 'Alexander Wright').toUpperCase(),
            expiry: '11/30',
            cvv: '319',
            type: 'Visa',
            cardTier: 'Emerald Platinum',
            isFrozen: false,
            spendingLimit: 1000000,
            monthlySpent: 185000,
        }
    ]);

    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const handleToggleCardFreeze = (cardId: string) => {
        setCards((prev) =>
            prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
        );
    };

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([refreshAccounts(), refreshTransactions()]);
        setTimeout(() => setIsRefreshing(false), 600);
    };

    // Calculate income and expense from transactions
    const totalIncome = transactions
        .filter((t) => t.direction === 'INCOMING')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = transactions
        .filter((t) => t.direction === 'OUTGOING')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="dashboard-page animate-fade-in">
            {/* Top Hero Banner */}
            <div className="dashboard-hero glass-card">
                <div className="hero-left">
                    <div className="hero-greeting">
                        <span className="badge badge-success">
                            <Sparkles size={13} /> Active Wealth Portfolio
                        </span>
                        <h1>Good day, {user?.name?.split(' ')[0] || 'Member'}</h1>
                        <p className="hero-sub">
                            Here is the institutional overview of your multi-currency accounts and liquid reserves.
                        </p>
                    </div>

                    <div className="networth-box">
                        <span className="networth-label">TOTAL ESTIMATED NET WORTH</span>
                        <div className="networth-value-row">
                            <span className="networth-val amount-mono">
                                {isPrivacyEnabled ? '₹ ••••••••' : `₹ ${totalBalanceINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </span>
                            <span className="networth-growth">
                                <TrendingUp size={16} /> +8.4% this month
                            </span>
                        </div>
                        <div className="accounts-breakdown-pills">
                            {accounts.map((acc) => (
                                <div key={acc._id} className="acc-mini-pill">
                                    <span className="pill-currency">{acc.currency}</span>
                                    <span className="pill-amount amount-mono">
                                        {isPrivacyEnabled ? '••••' : `${acc.currency} ${(acc.balance || 0).toLocaleString()}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-actions-dock">
                        <button className="btn-primary hero-dock-btn" onClick={onOpenSendModal}>
                            <Send size={18} />
                            <span>Send Money</span>
                        </button>
                        <button className="btn-secondary hero-dock-btn" onClick={onOpenDepositModal}>
                            <PlusCircle size={18} />
                            <span>Top-Up Vault</span>
                        </button>
                        <button className="btn-secondary hero-dock-btn" onClick={onOpenNewAccountModal}>
                            <Building size={18} />
                            <span>Open Account</span>
                        </button>
                        <button
                            className="btn-ghost hero-dock-btn refresh-btn"
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                            <span>Sync Ledger</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4 Stat Overview Cards */}
            <div className="grid-4 stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-top">
                        <span className="stat-title">Monthly Cash Inflow</span>
                        <div className="stat-icon-wrap in-icon"><ArrowDownLeft size={18} /></div>
                    </div>
                    <div className="stat-val amount-mono text-positive">
                        {isPrivacyEnabled ? '••••' : `+₹ ${totalIncome.toLocaleString()}`}
                    </div>
                    <span className="stat-foot text-positive"><TrendingUp size={14} /> +12% vs last month</span>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-top">
                        <span className="stat-title">Monthly Outflow</span>
                        <div className="stat-icon-wrap out-icon"><ArrowUpRight size={18} /></div>
                    </div>
                    <div className="stat-val amount-mono text-negative">
                        {isPrivacyEnabled ? '••••' : `-₹ ${totalExpense.toLocaleString()}`}
                    </div>
                    <span className="stat-foot text-secondary">42 transactions logged</span>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-top">
                        <span className="stat-title">Active Bank Accounts</span>
                        <div className="stat-icon-wrap acc-icon"><Wallet size={18} /></div>
                    </div>
                    <div className="stat-val amount-mono">{accounts.length} Accounts</div>
                    <span className="stat-foot text-emerald">ACID Double-Entry Verified</span>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-top">
                        <span className="stat-title">Security & Liquidity</span>
                        <div className="stat-icon-wrap sec-icon"><ShieldCheck size={18} /></div>
                    </div>
                    <div className="stat-val amount-mono">Tier 1 Prime</div>
                    <span className="stat-foot text-emerald">256-bit Hardware Key Active</span>
                </div>
            </div>

            {/* Main Middle Row: Virtual Card & Live Transactions */}
            <div className="dashboard-main-grid">
                {/* Left: Virtual Card & Quick Send widget */}
                <div className="main-grid-left">
                    <div className="section-card glass-card">
                        <div className="section-header">
                            <div>
                                <h3>Smart Virtual Cards</h3>
                                <p className="section-sub">Zero-liability instant contactless & online debit</p>
                            </div>
                            <div className="card-pagers">
                                {cards.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`card-dot ${i === activeCardIndex ? 'active' : ''}`}
                                        onClick={() => setActiveCardIndex(i)}
                                        aria-label={`Card ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {cards[activeCardIndex] && (
                            <VirtualCard
                                card={cards[activeCardIndex]}
                                onToggleFreeze={handleToggleCardFreeze}
                            />
                        )}

                        <div className="card-spending-bar">
                            <div className="flex-between font-xs mb-1">
                                <span className="text-secondary">Monthly Spending Limit</span>
                                <span className="amount-mono">
                                    ₹{cards[activeCardIndex]?.monthlySpent.toLocaleString()} / ₹{cards[activeCardIndex]?.spendingLimit.toLocaleString()}
                                </span>
                            </div>
                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(100, (cards[activeCardIndex]?.monthlySpent / cards[activeCardIndex]?.spendingLimit) * 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* FX Rates Widget */}
                    <div className="fx-rates-card glass-card">
                        <div className="section-header">
                            <h4>Live Foreign Exchange (FX) Rates</h4>
                            <span className="badge badge-info">Live Ticker</span>
                        </div>
                        <div className="fx-grid">
                            <div className="fx-item">
                                <span className="fx-pair">USD / INR</span>
                                <span className="fx-rate amount-mono">₹86.42</span>
                                <span className="fx-change text-positive">+0.14%</span>
                            </div>
                            <div className="fx-item">
                                <span className="fx-pair">EUR / INR</span>
                                <span className="fx-rate amount-mono">₹91.85</span>
                                <span className="fx-change text-negative">-0.08%</span>
                            </div>
                            <div className="fx-item">
                                <span className="fx-pair">GBP / INR</span>
                                <span className="fx-rate amount-mono">₹109.20</span>
                                <span className="fx-change text-positive">+0.32%</span>
                            </div>
                            <div className="fx-item">
                                <span className="fx-pair">AED / INR</span>
                                <span className="fx-rate amount-mono">₹23.52</span>
                                <span className="fx-change text-positive">+0.05%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Recent Transactions Feed */}
                <div className="main-grid-right">
                    <div className="section-card glass-card tx-feed-card">
                        <div className="section-header">
                            <div>
                                <h3>Recent Ledger Transactions</h3>
                                <p className="section-sub">Synchronized real-time with double-entry ledger</p>
                            </div>
                            <button className="btn-ghost btn-sm" onClick={onOpenSendModal}>
                                <span>New Transfer</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="transactions-list">
                            {transactions.length === 0 ? (
                                <div className="empty-tx-state">
                                    <Layers size={40} className="text-tertiary mb-2" />
                                    <p>No transactions found on this account yet.</p>
                                    <button className="btn-primary btn-sm mt-3" onClick={onOpenSendModal}>
                                        Make First Transfer
                                    </button>
                                </div>
                            ) : (
                                transactions.slice(0, 6).map((tx) => {
                                    const isOut = tx.direction === 'OUTGOING';

                                    return (
                                        <div
                                            key={tx._id}
                                            className="tx-item-row"
                                            onClick={() => setSelectedTxForReceipt(tx)}
                                            title="Click to view full double-entry receipt"
                                        >
                                            <div className="tx-item-left">
                                                <div className={`tx-icon-bubble ${isOut ? 'debit' : 'credit'}`}>
                                                    {isOut ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                                </div>
                                                <div className="tx-item-info">
                                                    <span className="tx-item-title">
                                                        {tx.recipientName || tx.senderName || (isOut ? `Wire to •••• ${tx.toAccount?.slice(-4)}` : `Deposit from •••• ${tx.fromAccount?.slice(-4)}`)}
                                                    </span>
                                                    <span className="tx-item-meta">
                                                        {new Date(tx.createdAt).toLocaleDateString()} &bull; {tx.category || 'Wire Transfer'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="tx-item-right">
                                                <span className={`tx-amount amount-mono ${isOut ? 'text-negative' : 'text-positive'}`}>
                                                    {isOut ? '-' : '+'}{tx.currency || 'INR'} {tx.amount.toLocaleString()}
                                                </span>
                                                <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            <ReceiptModal
                transaction={selectedTxForReceipt}
                onClose={() => setSelectedTxForReceipt(null)}
            />
        </div>
    );
};

export default Dashboard;