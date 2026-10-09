import React, { useState } from 'react';
import {
    Search,
    ShoppingBag,
    Briefcase,
    Zap,
    Coffee,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    CheckCircle2,
    X,
    Copy
} from 'lucide-react';
import './MobileScreens.css';

const TransactionHistoryScreen: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Income' | 'Expense' | 'Transfers'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

    const historyData = [
        {
            dateHeader: 'Today',
            items: [
                { id: 'tx_1', name: 'Apple Store NYC', category: 'Shopping', time: '2:15 PM', amount: -199.00, type: 'Expense', icon: ShoppingBag, ref: 'TX_98124' },
                { id: 'tx_2', name: 'Transfer to Sam Richardson', category: 'Transfers', time: '11:30 AM', amount: -150.00, type: 'Transfers', icon: ArrowUpRight, ref: 'TX_98125' },
            ]
        },
        {
            dateHeader: 'Yesterday',
            items: [
                { id: 'tx_3', name: 'Apex Payroll Deposit', category: 'Salary', time: '9:00 AM', amount: 4850.00, type: 'Income', icon: Briefcase, ref: 'TX_98126' },
                { id: 'tx_4', name: 'ConEdison Electricity', category: 'Utilities', time: '4:20 PM', amount: -84.50, type: 'Expense', icon: Zap, ref: 'TX_98127' },
            ]
        },
        {
            dateHeader: 'October 5, 2026',
            items: [
                { id: 'tx_5', name: 'Blue Bottle Coffee', category: 'Dining', time: '8:45 AM', amount: -6.75, type: 'Expense', icon: Coffee, ref: 'TX_98128' },
                { id: 'tx_6', name: 'Dividend Payout Vanguard', category: 'Investment', time: '10:00 AM', amount: 220.00, type: 'Income', icon: ArrowDownLeft, ref: 'TX_98129' },
            ]
        }
    ];

    const filterOptions: ('All' | 'Income' | 'Expense' | 'Transfers')[] = ['All', 'Income', 'Expense', 'Transfers'];

    return (
        <div className="mobile-screen-content animate-fade-in">
            <span className="section-heading">Transaction Statements</span>

            {/* Search */}
            <div className="input-field-wrap mt-3">
                <Search size={18} className="search-icon-input" color="#6B7280" />
                <input
                    type="text"
                    placeholder="Search payees, amounts..."
                    className="input-box pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Chips */}
            <div className="filter-chips-row mt-3">
                {filterOptions.map((opt) => (
                    <button
                        key={opt}
                        className={`chip-pill ${filter === opt ? 'active' : ''}`}
                        onClick={() => setFilter(opt)}
                    >
                        <span>{opt}</span>
                    </button>
                ))}
            </div>

            {/* Grouped Transaction List */}
            <div className="grouped-tx-container mt-4">
                {historyData.map((group) => {
                    const filteredItems = group.items.filter((it) => {
                        const matchFilter = filter === 'All' || it.type === filter;
                        const matchSearch = !searchQuery.trim() || it.name.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchFilter && matchSearch;
                    });

                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={group.dateHeader} className="tx-group-section">
                            <span className="date-group-heading caption-label font-medium">{group.dateHeader}</span>

                            <div className="card-clean p-0 overflow-hidden mt-1">
                                {filteredItems.map((tx, idx) => {
                                    const Icon = tx.icon;
                                    const isCredit = tx.amount > 0;

                                    return (
                                        <div
                                            key={tx.id}
                                            className={`tx-row-item ${idx !== filteredItems.length - 1 ? 'has-divider' : ''}`}
                                            onClick={() => setSelectedReceipt(tx)}
                                        >
                                            <div className="tx-row-left">
                                                <div className="tx-row-icon-box">
                                                    <Icon size={18} color="#1E5EFF" />
                                                </div>
                                                <div className="tx-row-info">
                                                    <span className="body-text font-medium text-heading">{tx.name}</span>
                                                    <span className="caption-label">{tx.time} &bull; {tx.category}</span>
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
                    );
                })}
            </div>

            {/* Transaction Receipt Modal */}
            {selectedReceipt && (
                <div className="mobile-modal-backdrop" onClick={() => setSelectedReceipt(null)}>
                    <div className="mobile-modal-sheet card-clean" onClick={(e) => e.stopPropagation()}>
                        <div className="flex-between">
                            <span className="caption-label font-medium">TRANSACTION RECEIPT</span>
                            <button className="p-1" onClick={() => setSelectedReceipt(null)}>
                                <X size={18} color="#6B7280" />
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <div className="success-badge-sm">
                                <CheckCircle2 size={16} color="#16A34A" />
                                <span>Settled &bull; Double-Entry Verified</span>
                            </div>
                            <h3 className="balance-amount mt-2">
                                {selectedReceipt.amount > 0 ? '+' : '-'}${Math.abs(selectedReceipt.amount).toFixed(2)}
                            </h3>
                            <p className="body-text font-medium text-heading">{selectedReceipt.name}</p>
                        </div>

                        <div className="card-secondary mt-3">
                            <div className="flex-between font-xs">
                                <span className="text-secondary">Ref ID:</span>
                                <span className="font-medium text-heading">{selectedReceipt.ref}</span>
                            </div>
                            <div className="flex-between font-xs mt-1">
                                <span className="text-secondary">Category:</span>
                                <span className="font-medium text-heading">{selectedReceipt.category}</span>
                            </div>
                            <div className="flex-between font-xs mt-1">
                                <span className="text-secondary">Fee:</span>
                                <span className="text-success font-medium">$0.00 (Free)</span>
                            </div>
                        </div>

                        <button className="btn-primary mt-3" onClick={() => setSelectedReceipt(null)}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistoryScreen;
