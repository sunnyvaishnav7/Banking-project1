import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Transaction } from '../../types';
import ReceiptModal from '../../components/Modals/ReceiptModal';
import {
    ReceiptText,
    Search,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Layers,
    Calendar,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import './TransactionsPage.css';

const TransactionsPage: React.FC = () => {
    const { transactions, refreshTransactions } = useAuth();
    const { showToast } = useToast();

    const [filterType, setFilterType] = useState<'ALL' | 'INCOMING' | 'OUTGOING'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshTransactions();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    // Filter transactions
    const filteredTransactions = transactions.filter((tx) => {
        const matchesFilter =
            filterType === 'ALL' ||
            (filterType === 'INCOMING' && tx.direction === 'INCOMING') ||
            (filterType === 'OUTGOING' && tx.direction === 'OUTGOING');

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !searchQuery.trim() ||
            tx._id.toLowerCase().includes(q) ||
            tx.amount.toString().includes(q) ||
            (tx.recipientName && tx.recipientName.toLowerCase().includes(q)) ||
            (tx.senderName && tx.senderName.toLowerCase().includes(q)) ||
            (tx.category && tx.category.toLowerCase().includes(q));

        return matchesFilter && matchesSearch;
    });

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) {
            showToast('No transactions to export', 'warning');
            return;
        }

        const headers = ['Transaction ID', 'Direction', 'Amount', 'Currency', 'Status', 'From Account', 'To Account', 'Date'];
        const rows = filteredTransactions.map((t) => [
            t._id,
            t.direction || 'TRANSFER',
            t.amount,
            t.currency || 'INR',
            t.status,
            t.fromAccount,
            t.toAccount,
            t.createdAt
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ApexBank_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Statement exported to CSV successfully', 'success');
    };

    return (
        <div className="transactions-page animate-fade-in">
            <div className="page-header-row">
                <div>
                    <h1>Ledger Statements & Audit Trail</h1>
                    <p className="page-sub">
                        Immutable double-entry transaction record with cryptographic verification.
                    </p>
                </div>
                <div className="page-actions-row">
                    <button className="btn-secondary btn-sm" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        <span>Sync</span>
                    </button>
                    <button className="btn-primary btn-sm" onClick={handleExportCSV}>
                        <Download size={14} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="statement-controls glass-card">
                <div className="controls-left">
                    <div className="filter-pill-group">
                        <button
                            className={`filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
                            onClick={() => setFilterType('ALL')}
                        >
                            All ({transactions.length})
                        </button>
                        <button
                            className={`filter-pill ${filterType === 'INCOMING' ? 'active' : ''}`}
                            onClick={() => setFilterType('INCOMING')}
                        >
                            Incoming / Credits
                        </button>
                        <button
                            className={`filter-pill ${filterType === 'OUTGOING' ? 'active' : ''}`}
                            onClick={() => setFilterType('OUTGOING')}
                        >
                            Outgoing / Debits
                        </button>
                    </div>
                </div>

                <div className="controls-right">
                    <div className="search-box table-search">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Filter by ID, amount, payee..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Statement Table */}
            <div className="statement-table-card glass-card">
                <div className="table-responsive">
                    <table className="statement-table">
                        <thead>
                            <tr>
                                <th>Transaction / Payee</th>
                                <th>Category</th>
                                <th>Timestamp</th>
                                <th>Transaction ID</th>
                                <th>Status</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-table-cell">
                                        <Layers size={36} className="text-tertiary mb-2" />
                                        <p>No transactions match the selected filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => {
                                    const isOut = tx.direction === 'OUTGOING';

                                    return (
                                        <tr
                                            key={tx._id}
                                            className="clickable-row"
                                            onClick={() => setSelectedTx(tx)}
                                            title="Click to view full double-entry receipt"
                                        >
                                            <td>
                                                <div className="tx-table-payee">
                                                    <div className={`tx-icon-bubble sm ${isOut ? 'debit' : 'credit'}`}>
                                                        {isOut ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                                    </div>
                                                    <span className="payee-title">
                                                        {tx.recipientName || tx.senderName || (isOut ? `Wire to •••• ${tx.toAccount?.slice(-4)}` : `Credit from •••• ${tx.fromAccount?.slice(-4)}`)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-neutral">{tx.category || 'Wire Transfer'}</span>
                                            </td>
                                            <td>
                                                <span className="text-secondary font-xs">
                                                    {new Date(tx.createdAt).toLocaleString()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="amount-mono font-xs text-tertiary">
                                                    {tx._id}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className={`tx-amount amount-mono ${isOut ? 'text-negative' : 'text-positive'}`}>
                                                    {isOut ? '-' : '+'}{tx.currency || 'INR'} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Receipt Modal */}
            <ReceiptModal
                transaction={selectedTx}
                onClose={() => setSelectedTx(null)}
            />
        </div>
    );
};

export default TransactionsPage;
