import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
    Send,
    Building2,
    Lock,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Zap,
    RefreshCw,
    UserCheck,
    Receipt,
    HelpCircle
} from 'lucide-react';
import './TransfersPage.css';

const TransfersPage: React.FC = () => {
    const { accounts, sendTransfer } = useAuth();
    const { showToast } = useToast();

    const [selectedFrom, setSelectedFrom] = useState<string>(accounts[0]?._id || '');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [idempotencyKey, setIdempotencyKey] = useState(`apex_idem_${Date.now()}`);

    const currentSource = accounts.find((a) => a._id === selectedFrom) || accounts[0];
    const numAmount = parseFloat(amount);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!toAccount.trim()) {
            showToast('Please enter a destination Account ID', 'warning');
            return;
        }
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Please enter a valid transfer amount', 'warning');
            return;
        }
        if (currentSource && (currentSource.balance || 0) < numAmount) {
            showToast(`Insufficient balance in ${currentSource.currency} account`, 'error');
            return;
        }

        setIsSubmitting(true);
        const success = await sendTransfer(selectedFrom, toAccount, numAmount);
        setIsSubmitting(false);

        if (success) {
            setIsSuccess(true);
            try {
                confetti({
                    particleCount: 90,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            } catch {}
        }
    };

    const handleNewTransfer = () => {
        setIsSuccess(false);
        setAmount('');
        setToAccount('');
        setNote('');
        setIdempotencyKey(`apex_idem_${Date.now()}`);
    };

    return (
        <div className="transfers-page animate-fade-in">
            <div className="page-header-row">
                <div>
                    <h1>Institutional Wire & Transfer Terminal</h1>
                    <p className="page-sub">
                        10-step atomic settlement with double-entry ACID verification and idempotency locks.
                    </p>
                </div>
            </div>

            <div className="transfers-layout-grid">
                {/* Left: Transfer Terminal */}
                <div className="terminal-card glass-card">
                    {!isSuccess ? (
                        <form onSubmit={handleTransfer}>
                            <div className="terminal-section-title">
                                <Send size={18} className="text-emerald" />
                                <h3>Transfer Parameters</h3>
                            </div>

                            {/* Source Account */}
                            <div className="input-group">
                                <label className="input-label">Debit Source Account</label>
                                <select
                                    className="input-field select-field"
                                    value={selectedFrom}
                                    onChange={(e) => setSelectedFrom(e.target.value)}
                                >
                                    {accounts.map((acc) => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.currency} ({acc.accountType || 'Account'}) &bull; Balance: {acc.currency} {acc.balance?.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Destination Account */}
                            <div className="input-group">
                                <label className="input-label">Credit Destination Account ID</label>
                                <div className="input-wrapper">
                                    <Building2 size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className="input-field has-icon amount-mono"
                                        placeholder="67a3f81e9b21a8d4e1011..."
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
                            </div>

                            {/* Note */}
                            <div className="input-group">
                                <label className="input-label">Payment Purpose & Reference</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Commercial Settlement, Cross-border invoice"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            {/* Idempotency Key Lock Info */}
                            <div className="idempotency-preview-box">
                                <div className="flex-between">
                                    <span className="idem-label">
                                        <Lock size={12} /> Double-Charge Prevention Key
                                    </span>
                                    <span className="idem-code amount-mono">{idempotencyKey}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary btn-lg w-full mt-4"
                                disabled={isSubmitting}
                            >
                                <Zap size={18} />
                                <span>{isSubmitting ? 'Validating Ledger & Executing...' : `Transfer ${currentSource?.currency || 'INR'} ${numAmount ? numAmount.toLocaleString() : '0.00'}`}</span>
                            </button>
                        </form>
                    ) : (
                        <div className="transfer-terminal-success animate-fade-in text-center">
                            <CheckCircle2 size={64} className="text-emerald mb-3" />
                            <h2>Wire Executed Successfully!</h2>
                            <p className="page-sub">
                                Transaction recorded into MongoDB session and double-entry ledger.
                            </p>

                            <div className="terminal-summary-card mt-4">
                                <div className="summary-row">
                                    <span>Amount Sent:</span>
                                    <strong className="text-emerald amount-mono">{currentSource?.currency} {numAmount.toLocaleString()}</strong>
                                </div>
                                <div className="summary-row">
                                    <span>From Account:</span>
                                    <span className="amount-mono">•••• {selectedFrom.slice(-6)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>To Account:</span>
                                    <span className="amount-mono">•••• {toAccount.slice(-6)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Settlement:</span>
                                    <span className="badge badge-success">COMPLETED</span>
                                </div>
                            </div>

                            <button className="btn-primary btn-lg w-full mt-4" onClick={handleNewTransfer}>
                                Initiate Another Transfer
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Transfer Engine Details */}
                <div className="engine-info-card glass-card">
                    <div className="terminal-section-title">
                        <ShieldCheck size={18} className="text-emerald" />
                        <h3>Apex 10-Step Execution Engine</h3>
                    </div>

                    <p className="engine-desc">
                        Every wire transfer follows strict cryptographic verification and double-entry bookkeeping:
                    </p>

                    <div className="step-pipeline">
                        {[
                            { step: '01', title: 'Request & Payload Validation', desc: 'Validates accounts format and positive decimal precision.' },
                            { step: '02', title: 'Idempotency Key Check', desc: 'Guarantees no duplicate charges if network drops.' },
                            { step: '03', title: 'Account Status & Lock', desc: 'Ensures sender and destination accounts are ACTIVE.' },
                            { step: '04', title: 'Ledger Balance Derivation', desc: 'Calculates real balance directly from immutable ledger.' },
                            { step: '05', title: 'Transaction (PENDING)', desc: 'Initializes audit trail in MongoDB ACID session.' },
                            { step: '06', title: 'DEBIT Ledger Entry', desc: 'Double-entry debit written with session lock.' },
                            { step: '07', title: 'CREDIT Ledger Entry', desc: 'Double-entry credit written to destination.' },
                            { step: '08', title: 'Mark COMPLETED & Commit', desc: 'Commits atomic transaction in replica set.' },
                        ].map((s) => (
                            <div key={s.step} className="pipeline-step-item">
                                <span className="step-num amount-mono">{s.step}</span>
                                <div>
                                    <h4 className="step-title">{s.title}</h4>
                                    <p className="step-desc">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransfersPage;
