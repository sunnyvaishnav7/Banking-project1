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
    Coffee
} from 'lucide-react';
import './MobileScreens.css';

interface HomeDashboardScreenProps {
    userName?: string;
    onNavigateTab: (tab: string) => void;
    onSelectSuggestion?: (prompt: string) => void;
    onOpenSendMoney?: () => void;
}

const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
    userName = 'Alexander',
    onNavigateTab,
    onSelectSuggestion,
    onOpenSendMoney
}) => {
    const [showBalance, setShowBalance] = useState(true);

    const balanceAmount = 24850.75;

    const quickActions = [
        { id: 'send', label: 'Send', icon: Send, action: onOpenSendMoney || (() => onNavigateTab('transfers')) },
        { id: 'request', label: 'Request', icon: ArrowDownLeft, action: () => onNavigateTab('transfers') },
        { id: 'bills', label: 'Pay Bills', icon: FileText, action: () => onNavigateTab('transfers') },
        { id: 'topup', label: 'Top Up', icon: Plus, action: () => onNavigateTab('accounts') },
    ];

    const suggestionChips = [
        'Check my spending this month',
        'Freeze my card',
        'Send $150 to Sam',
        'Show savings yield'
    ];

    const recentTransactions = [
        { id: 'tx_1', name: 'Apple Store NYC', date: 'Today, 2:15 PM', amount: -199.00, type: 'debit', icon: ShoppingBag },
        { id: 'tx_2', name: 'Apex Payroll Deposit', date: 'Yesterday', amount: 4850.00, type: 'credit', icon: Briefcase },
        { id: 'tx_3', name: 'ConEdison Electricity', date: 'Oct 7', amount: -84.50, type: 'debit', icon: Zap },
        { id: 'tx_4', name: 'Blue Bottle Coffee', date: 'Oct 6', amount: -6.75, type: 'debit', icon: Coffee },
    ];

    return (
        <div className="mobile-screen-content animate-fade-in">
            {/* Greeting */}
            <div className="home-greeting-row">
                <span className="section-heading">Good morning, {userName.split(' ')[0]}</span>
            </div>

            {/* Total Balance Card */}
            <div className="card-clean balance-card">
                <div className="balance-card-top">
                    <span className="caption-label">Total Balance</span>
                    <button
                        className="eye-toggle-btn"
                        onClick={() => setShowBalance(!showBalance)}
                        aria-label="Toggle balance visibility"
                    >
                        {showBalance ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                    </button>
                </div>

                <div className="balance-amount mt-1">
                    {showBalance ? `$${balanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$ ••••••••'}
                </div>

                <div className="balance-card-foot mt-2">
                    <span className="caption-label flex-align-gap">
                        <span className="growth-indicator">
                            <TrendingUp size={13} color="#16A34A" /> +$1,240.00
                        </span>
                        <span>this month</span>
                    </span>
                </div>
            </div>

            {/* Quick Actions (4 circular blue icon buttons) */}
            <div className="quick-actions-grid mt-4">
                {quickActions.map((qa) => {
                    const Icon = qa.icon;

                    return (
                        <button key={qa.id} className="quick-action-item" onClick={qa.action}>
                            <div className="quick-action-circle">
                                <Icon size={20} color="#FFFFFF" strokeWidth={2} />
                            </div>
                            <span className="caption-label text-body font-medium">{qa.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Suggested for you (ChatGPT-style prompt chips) */}
            <div className="mt-4">
                <div className="flex-between mb-2">
                    <span className="caption-label font-medium flex-align-gap">
                        <Sparkles size={14} color="#1E5EFF" />
                        <span>SUGGESTED FOR YOU</span>
                    </span>
                </div>
                <div className="horizontal-chips-scroll">
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

            {/* Spending Insights Mini Card with clean blue bar visualizer */}
            <div className="card-clean mt-4" onClick={() => onNavigateTab('assistant')}>
                <div className="flex-between">
                    <div>
                        <span className="section-heading">Monthly Spending</span>
                        <p className="caption-label mt-1">$1,420.25 of $3,500 target</p>
                    </div>
                    <ChevronRight size={18} color="#6B7280" />
                </div>

                <div className="mini-chart-bars mt-3">
                    {[35, 60, 45, 80, 50, 95, 40].map((h, i) => (
                        <div key={i} className="mini-bar-col">
                            <div className="mini-bar-fill" style={{ height: `${h}%` }}></div>
                            <span className="caption-label font-xs">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="mt-4">
                <div className="flex-between mb-2">
                    <span className="section-heading">Recent Transactions</span>
                    <button className="btn-text p-0 text-xs" onClick={() => onNavigateTab('transactions')}>
                        See all
                    </button>
                </div>

                <div className="card-clean p-0 overflow-hidden">
                    {recentTransactions.map((tx, idx) => {
                        const Icon = tx.icon;
                        const isCredit = tx.type === 'credit';

                        return (
                            <div key={tx.id} className={`tx-row-item ${idx !== recentTransactions.length - 1 ? 'has-divider' : ''}`}>
                                <div className="tx-row-left">
                                    <div className="tx-row-icon-box">
                                        <Icon size={18} color="#1E5EFF" />
                                    </div>
                                    <div className="tx-row-info">
                                        <span className="body-text font-medium text-heading">{tx.name}</span>
                                        <span className="caption-label">{tx.date}</span>
                                    </div>
                                </div>
                                <div className="tx-row-right">
                                    <span className={`body-text font-medium tabular-nums ${isCredit ? 'text-success' : 'text-heading'}`}>
                                        {isCredit ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomeDashboardScreen;
