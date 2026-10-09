import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Send,
    ArrowDownLeft,
    FileText,
    Plus,
    Sparkles,
    ChevronRight,
    TrendingUp,
    ShoppingBag,
    Zap,
    Briefcase,
    Coffee,
    CreditCard,
    Lock,
    Unlock,
    Wifi,
    ArrowUpRight,
    ShieldCheck
} from 'lucide-react';
import './DesktopStyles.css';

interface DesktopDashboardScreenProps {
    userName?: string;
    onNavigateTab: (tab: string) => void;
    onSelectSuggestion?: (prompt: string) => void;
}

const DesktopDashboardScreen: React.FC<DesktopDashboardScreenProps> = ({
    userName = 'Alexander Wright',
    onNavigateTab,
    onSelectSuggestion
}) => {
    const [showBalance, setShowBalance] = useState(true);
    const [isFrozen, setIsFrozen] = useState(false);
    const [showCVV, setShowCVV] = useState(false);

    const balanceAmount = 24850.75;

    const quickActions = [
        { id: 'send', label: 'Send Wire', icon: Send, action: () => onNavigateTab('transfers') },
        { id: 'request', label: 'Request Money', icon: ArrowDownLeft, action: () => onNavigateTab('transfers') },
        { id: 'bills', label: 'Pay Bills', icon: FileText, action: () => onNavigateTab('transfers') },
        { id: 'topup', label: 'Top-Up Vault', icon: Plus, action: () => onNavigateTab('cards') },
    ];

    const suggestionChips = [
        'Check my spending this month',
        'Freeze my card',
        'Send $150 to Sam Richardson',
        'Show savings yield & APY'
    ];

    const recentTransactions = [
        { id: 'tx_1', name: 'Apple Store 5th Ave NYC', date: 'Today, 2:15 PM', category: 'Shopping', amount: -199.00, type: 'debit', icon: ShoppingBag },
        { id: 'tx_2', name: 'Apex Technologies Payroll', date: 'Yesterday, 9:00 AM', category: 'Salary', amount: 4850.00, type: 'credit', icon: Briefcase },
        { id: 'tx_3', name: 'ConEdison Electricity & Power', date: 'Oct 7, 2026', category: 'Utilities', amount: -84.50, type: 'debit', icon: Zap },
        { id: 'tx_4', name: 'Blue Bottle Coffee Roasters', date: 'Oct 6, 2026', category: 'Dining', amount: -6.75, type: 'debit', icon: Coffee },
        { id: 'tx_5', name: 'Vanguard Dividend Distribution', date: 'Oct 5, 2026', category: 'Investment', amount: 220.00, type: 'credit', icon: ArrowDownLeft },
    ];

    return (
        <div className="desktop-dashboard animate-fade-in">
            {/* Top Net Worth Hero Card */}
            <div className="card-clean desktop-hero-card">
                <div>
                    <div className="flex-align-gap">
                        <span className="caption-label">TOTAL ESTIMATED LIQUID ASSETS</span>
                        <button
                            className="eye-toggle-btn"
                            onClick={() => setShowBalance(!showBalance)}
                            aria-label="Toggle balance visibility"
                        >
                            {showBalance ? <Eye size={16} color="#6B7280" /> : <EyeOff size={16} color="#6B7280" />}
                        </button>
                    </div>

                    <div className="balance-amount mt-1" style={{ fontSize: '40px' }}>
                        {showBalance ? `$${balanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$ ••••••••'}
                    </div>

                    <div className="flex-align-gap mt-2">
                        <span className="growth-indicator font-xs">
                            <TrendingUp size={14} color="#16A34A" /> +$1,240.00 (+8.4%)
                        </span>
                        <span className="caption-label">vs last month across 3 accounts</span>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex-align-gap" style={{ gap: '12px' }}>
                    {quickActions.map((qa) => {
                        const Icon = qa.icon;
                        return (
                            <button
                                key={qa.id}
                                className="btn-secondary"
                                style={{ width: 'auto', padding: '0 18px', height: '44px', fontSize: '13px' }}
                                onClick={qa.action}
                            >
                                <Icon size={16} />
                                <span>{qa.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="desktop-stats-grid">
                <div className="card-clean">
                    <div className="flex-between">
                        <span className="caption-label">MONTHLY CASH INFLOW</span>
                        <ArrowDownLeft size={18} color="#16A34A" />
                    </div>
                    <div className="balance-amount mt-1 text-success" style={{ fontSize: '24px' }}>
                        +$5,070.00
                    </div>
                    <span className="caption-label mt-1 block">2 deposits processed</span>
                </div>

                <div className="card-clean">
                    <div className="flex-between">
                        <span className="caption-label">MONTHLY OUTFLOW</span>
                        <ArrowUpRight size={18} color="#DC2626" />
                    </div>
                    <div className="balance-amount mt-1" style={{ fontSize: '24px' }}>
                        -$1,420.25
                    </div>
                    <span className="caption-label mt-1 block">40.5% of $3,500 target</span>
                </div>

                <div className="card-clean">
                    <div className="flex-between">
                        <span className="caption-label">ACTIVE SMART CARDS</span>
                        <CreditCard size={18} color="#1E5EFF" />
                    </div>
                    <div className="balance-amount mt-1" style={{ fontSize: '24px' }}>
                        2 Active Cards
                    </div>
                    <span className="caption-label mt-1 block">Obsidian & Titanium</span>
                </div>

                <div className="card-clean">
                    <div className="flex-between">
                        <span className="caption-label">SAVINGS YIELD (APY)</span>
                        <ShieldCheck size={18} color="#1E5EFF" />
                    </div>
                    <div className="balance-amount mt-1 text-primary" style={{ fontSize: '24px' }}>
                        7.2% APY
                    </div>
                    <span className="caption-label mt-1 block">Compounded daily</span>
                </div>
            </div>

            {/* Suggested Prompt Chips (ChatGPT Style) */}
            <div className="mt-4">
                <div className="flex-between mb-2">
                    <span className="caption-label font-medium flex-align-gap">
                        <Sparkles size={14} color="#1E5EFF" />
                        <span>AI ASSISTANT SUGGESTIONS</span>
                    </span>
                </div>
                <div className="flex-wrap gap-2">
                    {suggestionChips.map((chip, i) => (
                        <button
                            key={i}
                            className="chip-pill"
                            onClick={() => {
                                if (onSelectSuggestion) onSelectSuggestion(chip);
                                onNavigateTab('assistant');
                            }}
                        >
                            <span>{chip}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Split Row: Left Virtual Card & Right Statements */}
            <div className="desktop-dashboard-split">
                {/* Left Card Deck */}
                <div className="flex-col gap-3">
                    <div className="card-clean">
                        <div className="flex-between mb-3">
                            <span className="section-heading">Smart Virtual Card</span>
                            <span className="caption-label">Mastercard Infinite</span>
                        </div>

                        <div
                            className={`mobile-bank-card ${isFrozen ? 'card-locked' : ''}`}
                            style={{ background: 'linear-gradient(135deg, #1E5EFF 0%, #1446C7 100%)', height: '210px' }}
                        >
                            <div className="card-header-row">
                                <div className="card-brand-tag">
                                    <Sparkles size={14} color="#FFFFFF" />
                                    <span>CYBER BLUE TITANIUM</span>
                                </div>
                                <div className="card-network-row">
                                    <Wifi size={18} color="#FFFFFF" />
                                    <span className="card-network-text">Mastercard</span>
                                </div>
                            </div>

                            <div className="card-chip-box">
                                <div className="mobile-smart-chip">
                                    <div className="chip-bar" />
                                    <div className="chip-bar" />
                                </div>
                                {isFrozen && (
                                    <span className="locked-pill">
                                        <Lock size={12} /> FROZEN
                                    </span>
                                )}
                            </div>

                            <div className="card-number-display tabular-nums">
                                4291  8820  9912  4431
                            </div>

                            <div className="card-foot-row">
                                <div>
                                    <span className="card-label-xs">CARD HOLDER</span>
                                    <span className="card-value-sm">{userName.toUpperCase()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="card-label-xs">EXPIRES</span>
                                    <span className="card-value-sm">09/29</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Controls */}
                        <div className="flex-align-gap mt-3" style={{ gap: '10px' }}>
                            <button
                                className={`btn-secondary flex-1 ${isFrozen ? 'active-freeze' : ''}`}
                                style={{ height: '40px', fontSize: '12px' }}
                                onClick={() => setIsFrozen(!isFrozen)}
                            >
                                {isFrozen ? <Unlock size={15} /> : <Lock size={15} />}
                                <span>{isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
                            </button>

                            <button
                                className="btn-secondary flex-1"
                                style={{ height: '40px', fontSize: '12px' }}
                                onClick={() => setShowCVV(!showCVV)}
                            >
                                {showCVV ? <EyeOff size={15} /> : <Eye size={15} />}
                                <span>{showCVV ? 'CVV: 842' : 'Show Details'}</span>
                            </button>
                        </div>
                    </div>

                    {/* FX Rates Widget */}
                    <div className="card-clean">
                        <div className="flex-between mb-2">
                            <span className="section-heading">Live FX Currency Ticker</span>
                            <span className="caption-label">Zero Markup</span>
                        </div>
                        <div className="flex-col gap-2">
                            <div className="flex-between font-xs py-1 border-b">
                                <span className="font-medium text-heading">USD / EUR</span>
                                <span className="tabular-nums font-medium">0.9214 €</span>
                            </div>
                            <div className="flex-between font-xs py-1 border-b">
                                <span className="font-medium text-heading">USD / GBP</span>
                                <span className="tabular-nums font-medium">0.7840 £</span>
                            </div>
                            <div className="flex-between font-xs py-1">
                                <span className="font-medium text-heading">USD / INR</span>
                                <span className="tabular-nums font-medium">86.4200 ₹</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Recent Transactions */}
                <div className="card-clean p-0 overflow-hidden">
                    <div className="flex-between" style={{ padding: '20px 24px 12px 24px' }}>
                        <div>
                            <span className="section-heading">Recent Ledger Transactions</span>
                            <p className="caption-label mt-1">Double-entry verified settlements</p>
                        </div>
                        <button
                            className="btn-text p-0 text-xs"
                            onClick={() => onNavigateTab('transactions')}
                        >
                            View Statement &rarr;
                        </button>
                    </div>

                    <div className="desktop-tx-list">
                        {recentTransactions.map((tx, idx) => {
                            const Icon = tx.icon;
                            const isCredit = tx.type === 'credit';

                            return (
                                <div
                                    key={tx.id}
                                    className={`tx-row-item ${idx !== recentTransactions.length - 1 ? 'has-divider' : ''}`}
                                    style={{ padding: '16px 24px' }}
                                    onClick={() => onNavigateTab('transactions')}
                                >
                                    <div className="tx-row-left">
                                        <div className="tx-row-icon-box">
                                            <Icon size={18} color="#1E5EFF" />
                                        </div>
                                        <div className="tx-row-info">
                                            <span className="body-text font-medium text-heading">{tx.name}</span>
                                            <span className="caption-label">{tx.date} &bull; {tx.category}</span>
                                        </div>
                                    </div>
                                    <div className="tx-row-right">
                                        <span className={`body-text font-medium tabular-nums ${isCredit ? 'text-success' : 'text-heading'}`} style={{ fontSize: '15px' }}>
                                            {isCredit ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopDashboardScreen;
