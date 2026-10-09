import React from 'react';
import { Transaction } from '../../types';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle2, Copy, Printer, Share2, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import './Modals.css';

interface ReceiptModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
    const { showToast } = useToast();

    if (!transaction) return null;

    const handleCopyRef = () => {
        navigator.clipboard.writeText(transaction._id);
        showToast('Transaction ID copied to clipboard', 'info');
    };

    const handlePrint = () => {
        window.print();
    };

    const isOutgoing = transaction.direction === 'OUTGOING';

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content receipt-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="receipt-header">
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                    <div className="receipt-status-icon">
                        <CheckCircle2 size={44} className="text-emerald" />
                    </div>
                    <span className="receipt-badge">APEX WIRE RECEIPT</span>
                    <h2 className={`receipt-amount amount-mono ${isOutgoing ? 'text-negative' : 'text-positive'}`}>
                        {isOutgoing ? '-' : '+'}{transaction.currency || 'INR'} {transaction.amount?.toLocaleString()}
                    </h2>
                    <p className="receipt-status-text">Transaction Completed & Settled</p>
                </div>

                <div className="receipt-body">
                    <div className="receipt-ledger-box">
                        <div className="ledger-entry">
                            <span className="ledger-label">Type</span>
                            <span className="ledger-value">{isOutgoing ? 'Debit Transfer' : 'Credit Deposit'}</span>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Transaction ID</span>
                            <div className="ledger-value-copy" onClick={handleCopyRef} title="Click to copy">
                                <span className="amount-mono">{transaction._id}</span>
                                <Copy size={13} />
                            </div>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Idempotency Ref</span>
                            <span className="amount-mono font-xs">{transaction.idempotencyKey || 'IDEM_AUTO_SAFE'}</span>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Source Account</span>
                            <span className="amount-mono">•••• {transaction.fromAccount?.slice(-6) || 'SYSTEM'}</span>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Destination Account</span>
                            <span className="amount-mono">•••• {transaction.toAccount?.slice(-6) || 'VAULT'}</span>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Timestamp</span>
                            <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="ledger-entry">
                            <span className="ledger-label">Ledger Protocol</span>
                            <span>Double-Entry MongoDB ACID</span>
                        </div>
                    </div>

                    <div className="receipt-security-note">
                        <ShieldCheck size={16} className="text-emerald" />
                        <span>Cryptographically signed by Apex Core Banking Cluster</span>
                    </div>

                    <div className="receipt-footer-actions">
                        <button className="btn-secondary flex-1" onClick={handlePrint}>
                            <Printer size={16} />
                            <span>Print Receipt</span>
                        </button>
                        <button className="btn-primary flex-1" onClick={handleCopyRef}>
                            <Copy size={16} />
                            <span>Copy Details</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
