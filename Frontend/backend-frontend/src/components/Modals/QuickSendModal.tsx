import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
    X,
    Send,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    Building2,
    UserCheck,
    Lock
} from 'lucide-react';
import './Modals.css';

interface QuickSendModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialToAccount?: string;
}

const QuickSendModal: React.FC<QuickSendModalProps> = ({ isOpen, onClose, initialToAccount = '' }) => {
    const { accounts, sendTransfer } = useAuth();
    const { showToast } = useToast();

    const [selectedFromAccount, setSelectedFromAccount] = useState<string>(
        accounts.length > 0 ? accounts[0]._id : ''
    );
    const [toAccount, setToAccount] = useState<string>(initialToAccount);
    const [amount, setAmount] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
    const [pin, setPin] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quick Contacts
    const quickContacts = [
        { name: 'Sarah Jenkins', account: '67a3f81e9b21a8d4e1099999', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { name: 'Marcus Vance', account: '67a3f81e9b21a8d4e1088888', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { name: 'Elena Rostova', account: '67a3f81e9b21a8d4e1077777', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' }
    ];

    if (!isOpen) return null;

    const currentSource = accounts.find((a) => a._id === selectedFromAccount) || accounts[0];
    const numAmount = parseFloat(amount);

    const handleContinueToConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!toAccount.trim()) {
            showToast('Please specify a destination Account ID', 'warning');
            return;
        }
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Please enter a valid positive transfer amount', 'warning');
            return;
        }
        if (currentSource && (currentSource.balance || 0) < numAmount) {
            showToast(`Insufficient balance in ${currentSource.currency} account`, 'error');
            return;
        }
        setStep('confirm');
    };

    const handleExecuteTransfer = async () => {
        setIsSubmitting(true);
        const success = await sendTransfer(selectedFromAccount, toAccount, numAmount);
        setIsSubmitting(false);

        if (success) {
            setStep('success');
            try {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } catch {}
        }
    };

    const handleReset = () => {
        setStep('input');
        setAmount('');
        setToAccount('');
        setPin('');
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleReset}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-wrap">
                        <div className="modal-icon-badge">
                            <Send size={18} />
                        </div>
                        <div>
                            <h3>Instant Wire & Transfer</h3>
                            <p className="modal-sub">Protected by Apex 10-Step Transaction Engine</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={handleReset} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {step === 'input' && (
                        <form onSubmit={handleContinueToConfirm}>
                            {/* Source Account Picker */}
                            <div className="input-group">
                                <label className="input-label">From Account (Source)</label>
                                <select
                                    className="input-field select-field"
                                    value={selectedFromAccount}
                                    onChange={(e) => setSelectedFromAccount(e.target.value)}
                                >
                                    {accounts.map((acc) => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.currency} ({acc.accountType || 'Account'}) &bull; Available: {acc.currency} {acc.balance?.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quick Contacts */}
                            <div className="quick-payees-row">
                                <span className="quick-payee-label">Recent Payees:</span>
                                <div className="payees-list">
                                    {quickContacts.map((c) => (
                                        <button
                                            type="button"
                                            key={c.account}
                                            className={`payee-chip ${toAccount === c.account ? 'selected' : ''}`}
                                            onClick={() => setToAccount(c.account)}
                                        >
                                            <img src={c.avatar} alt={c.name} className="payee-avatar" />
                                            <span>{c.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Destination Account */}
                            <div className="input-group">
                                <label className="input-label">Destination Account ID</label>
                                <div className="input-wrapper">
                                    <Building2 size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        className="input-field has-icon amount-mono"
                                        placeholder="e.g. 67a3f81e9b21a8d4e10..."
                                        value={toAccount}
                                        onChange={(e) => setToAccount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="input-group">
                                <label className="input-label">Transfer Amount ({currentSource?.currency || 'INR'})</label>
                                <div className="amount-input-box">
                                    <span className="currency-prefix">{currentSource?.currency}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="large-amount-input amount-mono"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="quick-amounts-bar">
                                    {[500, 1000, 5000, 10000].map((val) => (
                                        <button
                                            type="button"
                                            key={val}
                                            className="quick-amount-pill"
                                            onClick={() => setAmount(val.toString())}
                                        >
                                            +{val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="input-group">
                                <label className="input-label">Payment Reference / Note (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Invoice #902, Rent payment"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn-primary btn-lg w-full mt-4">
                                <span>Review Transfer</span>
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {step === 'confirm' && (
                        <div className="confirm-step animate-fade-in">
                            <div className="transfer-summary-card">
                                <div className="summary-row">
                                    <span className="summary-label">Transfer Amount</span>
                                    <span className="summary-value highlight amount-mono">
                                        {currentSource?.currency} {numAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">From Account</span>
                                    <span className="summary-value amount-mono">•••• {selectedFromAccount.slice(-6)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">To Account</span>
                                    <span className="summary-value amount-mono">{toAccount}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Transfer Fee</span>
                                    <span className="summary-value text-positive">₹0.00 (Free Apex Wire)</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Settlement Speed</span>
                                    <span className="summary-value">Instant Ledger Sync</span>
                                </div>
                            </div>

                            {/* Security PIN Confirmation */}
                            <div className="input-group mt-4">
                                <label className="input-label flex-between">
                                    <span>Enter Security PIN (Demo: 1234)</span>
                                    <span className="text-tertiary"><Lock size={12} /> Secure Key</span>
                                </label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    className="input-field text-center font-mono"
                                    placeholder="••••"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="modal-actions-row mt-4">
                                <button
                                    type="button"
                                    className="btn-secondary flex-1"
                                    onClick={() => setStep('input')}
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary flex-2"
                                    onClick={handleExecuteTransfer}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Verifying Ledger...' : 'Confirm & Send Money'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="success-step animate-fade-in text-center">
                            <div className="success-check-icon">
                                <CheckCircle2 size={56} className="text-emerald" />
                            </div>
                            <h3>Payment Transferred!</h3>
                            <p className="modal-sub">
                                Successfully routed <strong>{currentSource?.currency} {numAmount.toLocaleString()}</strong> to destination account.
                            </p>

                            <div className="tx-receipt-preview amount-mono">
                                <div>Ref ID: TX_{Date.now().toString().slice(-8)}</div>
                                <div>Status: COMPLETED (Double-Entry Ledger Verified)</div>
                            </div>

                            <button className="btn-primary btn-lg w-full mt-6" onClick={handleReset}>
                                Done & Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickSendModal;
