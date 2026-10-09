import React, { useState } from 'react';
import {
    Search,
    UserCheck,
    ArrowRight,
    CheckCircle2,
    Shield,
    Fingerprint,
    Share2,
    RotateCcw,
    Delete,
    Plus,
    Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './MobileScreens.css';

interface TransferFlowScreenProps {
    onDone: () => void;
}

const TransferFlowScreen: React.FC<TransferFlowScreenProps> = ({ onDone }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
    const [amountStr, setAmountStr] = useState('0');
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const recentContacts = [
        { id: 'cnt_1', name: 'Sarah Jenkins', handle: 'sarah.j@apex', account: '•••• 9921', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 'cnt_2', name: 'Sam Richardson', handle: 'sam.r@apex', account: '•••• 4492', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { id: 'cnt_3', name: 'Elena Rostova', handle: 'elena@apex', account: '•••• 1102', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        { id: 'cnt_4', name: 'Marcus Vance', handle: 'marcus.v@apex', account: '•••• 8834', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    ];

    const handleKeypadPress = (val: string) => {
        if (val === 'del') {
            setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
        } else if (val === '.') {
            if (!amountStr.includes('.')) {
                setAmountStr((prev) => prev + '.');
            }
        } else {
            setAmountStr((prev) => (prev === '0' ? val : prev + val));
        }
    };

    const handleAuthorizeTransfer = () => {
        setIsAuthorizing(true);
        setTimeout(() => {
            setIsAuthorizing(false);
            setStep(4);
            try {
                confetti({
                    particleCount: 75,
                    spread: 60,
                    origin: { y: 0.6 }
                });
            } catch {}
        }, 600);
    };

    const numAmount = parseFloat(amountStr) || 0;

    return (
        <div className="mobile-screen-content animate-fade-in">
            {/* Step 1: Choose Recipient */}
            {step === 1 && (
                <div className="transfer-step-1">
                    <span className="section-heading">Send Money</span>
                    <p className="caption-label mt-1">Select a recipient or search payee</p>

                    {/* Search Field */}
                    <div className="input-field-wrap mt-3">
                        <Search size={18} className="search-icon-input" color="#6B7280" />
                        <input
                            type="text"
                            placeholder="Name, @handle, or account number"
                            className="input-box pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Recent Payees Grid */}
                    <div className="mt-4">
                        <span className="caption-label font-medium">RECENT RECIPIENTS</span>
                        <div className="recipients-avatar-row mt-2">
                            {recentContacts.map((c) => (
                                <button
                                    key={c.id}
                                    className="recipient-avatar-btn"
                                    onClick={() => {
                                        setSelectedRecipient(c);
                                        setStep(2);
                                    }}
                                >
                                    <img src={c.avatar} alt={c.name} className="recipient-img" />
                                    <span className="recipient-name-label">{c.name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* All Payees List */}
                    <div className="mt-4">
                        <span className="caption-label font-medium">ALL PAYEES</span>
                        <div className="card-clean p-0 overflow-hidden mt-2">
                            {recentContacts.map((c, idx) => (
                                <div
                                    key={c.id}
                                    className={`payee-list-row ${idx !== recentContacts.length - 1 ? 'has-divider' : ''}`}
                                    onClick={() => {
                                        setSelectedRecipient(c);
                                        setStep(2);
                                    }}
                                >
                                    <img src={c.avatar} alt={c.name} className="payee-row-avatar" />
                                    <div className="payee-row-info">
                                        <span className="body-text font-medium text-heading">{c.name}</span>
                                        <span className="caption-label">{c.handle} &bull; {c.account}</span>
                                    </div>
                                    <ArrowRight size={18} color="#6B7280" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Enter Amount with Numeric Keypad */}
            {step === 2 && (
                <div className="transfer-step-2 animate-fade-in">
                    <div className="flex-between">
                        <button className="btn-text p-0 text-xs" onClick={() => setStep(1)}>
                            &larr; Change Recipient
                        </button>
                        <span className="caption-label">Step 2 of 3</span>
                    </div>

                    {/* Recipient Pill */}
                    <div className="selected-recipient-pill mt-2">
                        <img src={selectedRecipient?.avatar} alt="" className="pill-avatar" />
                        <div>
                            <span className="body-text font-medium">{selectedRecipient?.name}</span>
                            <p className="caption-label">{selectedRecipient?.account}</p>
                        </div>
                    </div>

                    {/* Big Amount Display */}
                    <div className="amount-keypad-display mt-4">
                        <span className="currency-symbol">$</span>
                        <span className="amount-number-big tabular-nums">{amountStr}</span>
                    </div>
                    <span className="caption-label text-center block mt-1">
                        Available Balance: $18,430.00
                    </span>

                    {/* Custom Numeric Keypad (1-9, ., 0, del) */}
                    <div className="numeric-keypad-grid mt-4">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map((k) => (
                            <button
                                key={k}
                                className="keypad-btn"
                                onClick={() => handleKeypadPress(k)}
                            >
                                {k === 'del' ? <Delete size={22} color="#0B0B0B" /> : k}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn-primary mt-3"
                        disabled={numAmount <= 0}
                        onClick={() => setStep(3)}
                    >
                        <span>Continue to Review</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {/* Step 3: Review Screen with Summary Card & Biometrics */}
            {step === 3 && (
                <div className="transfer-step-3 animate-fade-in">
                    <div className="flex-between">
                        <button className="btn-text p-0 text-xs" onClick={() => setStep(2)}>
                            &larr; Edit Amount
                        </button>
                        <span className="caption-label">Final Review</span>
                    </div>

                    <h2 className="screen-title mt-2">Review Wire Transfer</h2>

                    {/* Summary Card */}
                    <div className="card-clean mt-3">
                        <div className="review-amount-center">
                            <span className="caption-label">TOTAL TRANSFER AMOUNT</span>
                            <span className="balance-amount text-primary mt-1">
                                ${numAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="divider-line" />

                        <div className="review-row">
                            <span className="caption-label">Recipient:</span>
                            <span className="body-text font-medium">{selectedRecipient?.name}</span>
                        </div>
                        <div className="review-row mt-2">
                            <span className="caption-label">Destination Account:</span>
                            <span className="body-text font-medium">{selectedRecipient?.account}</span>
                        </div>
                        <div className="review-row mt-2">
                            <span className="caption-label">Transfer Speed:</span>
                            <span className="body-text font-medium text-success">Instant Settlement</span>
                        </div>
                        <div className="review-row mt-2">
                            <span className="caption-label">Wire Fee:</span>
                            <span className="body-text font-medium text-success">$0.00 (Zero Fee)</span>
                        </div>
                    </div>

                    {/* Biometric Confirmation Button */}
                    <button
                        className="btn-primary mt-4"
                        onClick={handleAuthorizeTransfer}
                        disabled={isAuthorizing}
                    >
                        <Fingerprint size={20} />
                        <span>{isAuthorizing ? 'Authorizing with Face ID...' : `Confirm & Send $${numAmount.toFixed(2)}`}</span>
                    </button>
                </div>
            )}

            {/* Step 4: Success Screen with Blue Checkmark Animation */}
            {step === 4 && (
                <div className="transfer-step-4 animate-fade-in text-center">
                    <div className="success-icon-pop animate-pop">
                        <CheckCircle2 size={64} color="#1E5EFF" />
                    </div>

                    <h2 className="screen-title mt-3">Transfer Sent!</h2>
                    <p className="body-text text-secondary mt-1">
                        You have sent <strong>${numAmount.toFixed(2)}</strong> to {selectedRecipient?.name}.
                    </p>

                    <div className="card-secondary mt-4 text-left">
                        <div className="flex-between font-xs">
                            <span className="text-secondary">Reference ID:</span>
                            <span className="font-medium text-heading">#APEX_TX_98240</span>
                        </div>
                        <div className="flex-between font-xs mt-1">
                            <span className="text-secondary">Timestamp:</span>
                            <span className="font-medium text-heading">Just now</span>
                        </div>
                    </div>

                    <button className="btn-primary mt-4" onClick={onDone}>
                        Done
                    </button>

                    <button className="btn-secondary mt-2" onClick={onDone}>
                        <Share2 size={16} />
                        <span>Share Receipt</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransferFlowScreen;
