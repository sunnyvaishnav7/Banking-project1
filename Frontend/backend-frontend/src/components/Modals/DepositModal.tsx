import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { X, PlusCircle, ArrowDownCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import './Modals.css';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
    const { accounts, depositFunds } = useAuth();
    const { showToast } = useToast();

    const [selectedAccount, setSelectedAccount] = useState<string>(
        accounts.length > 0 ? accounts[0]._id : ''
    );
    const [amount, setAmount] = useState<string>('5000');
    const [method, setMethod] = useState<'card' | 'wire' | 'vault'>('vault');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const currentAccount = accounts.find((a) => a._id === selectedAccount) || accounts[0];
    const numAmount = parseFloat(amount);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Please enter a valid deposit amount', 'warning');
            return;
        }

        setIsProcessing(true);
        const success = await depositFunds(selectedAccount, numAmount);
        setIsProcessing(false);

        if (success) {
            try {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            } catch {}
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-wrap">
                        <div className="modal-icon-badge deposit-badge">
                            <PlusCircle size={18} />
                        </div>
                        <div>
                            <h3>Top-Up & Deposit Funds</h3>
                            <p className="modal-sub">Add liquidity to your account instantly</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleDeposit}>
                        {/* Target Account */}
                        <div className="input-group">
                            <label className="input-label">Deposit Target Account</label>
                            <select
                                className="input-field select-field"
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                            >
                                {accounts.map((acc) => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.currency} ({acc.accountType || 'Account'}) &bull; Balance: {acc.currency} {acc.balance?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Top-Up Method */}
                        <div className="input-group">
                            <label className="input-label">Funding Source Channel</label>
                            <div className="funding-methods-grid">
                                <div
                                    className={`funding-method-card ${method === 'vault' ? 'active' : ''}`}
                                    onClick={() => setMethod('vault')}
                                >
                                    <span className="method-name">System Vault</span>
                                    <span className="method-desc">Instant Initial Credit</span>
                                </div>
                                <div
                                    className={`funding-method-card ${method === 'card' ? 'active' : ''}`}
                                    onClick={() => setMethod('card')}
                                >
                                    <span className="method-name">Debit Card</span>
                                    <span className="method-desc">Visa / Mastercard</span>
                                </div>
                                <div
                                    className={`funding-method-card ${method === 'wire' ? 'active' : ''}`}
                                    onClick={() => setMethod('wire')}
                                >
                                    <span className="method-name">SWIFT / Wire</span>
                                    <span className="method-desc">Bank Clearing</span>
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="input-group">
                            <label className="input-label">Deposit Amount ({currentAccount?.currency || 'INR'})</label>
                            <div className="amount-input-box">
                                <span className="currency-prefix">{currentAccount?.currency}</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    className="large-amount-input amount-mono"
                                    placeholder="5000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="quick-amounts-bar">
                                {[1000, 5000, 25000, 100000].map((val) => (
                                    <button
                                        type="button"
                                        key={val}
                                        className="quick-amount-pill"
                                        onClick={() => setAmount(val.toString())}
                                    >
                                        +{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary btn-lg w-full mt-4"
                            disabled={isProcessing}
                        >
                            <ArrowDownCircle size={18} />
                            <span>{isProcessing ? 'Processing Credit...' : `Deposit ${currentAccount?.currency} ${numAmount ? numAmount.toLocaleString() : '0'}`}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DepositModal;
