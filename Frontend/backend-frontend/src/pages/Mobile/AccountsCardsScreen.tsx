import React, { useState } from 'react';
import {
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Sliders,
    Settings,
    Copy,
    Check,
    Wifi,
    Sparkles,
    Shield,
    ChevronRight,
    Building
} from 'lucide-react';
import './MobileScreens.css';

const AccountsCardsScreen: React.FC = () => {
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isFrozen, setIsFrozen] = useState(false);
    const [showCVV, setShowCVV] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const cards = [
        {
            id: 'c1',
            type: 'Mastercard',
            tier: 'Cyber Blue Titanium',
            number: '4291  8820  9912  4431',
            holder: 'ALEXANDER WRIGHT',
            expiry: '09/29',
            cvv: '842',
            bg: 'linear-gradient(135deg, #1E5EFF 0%, #1446C7 100%)'
        },
        {
            id: 'c2',
            type: 'Visa Infinite',
            tier: 'Global Travel Platinum',
            number: '5512  3901  2284  1098',
            holder: 'ALEXANDER WRIGHT',
            expiry: '11/30',
            cvv: '319',
            bg: 'linear-gradient(135deg, #0B0B0B 0%, #1E293B 100%)'
        }
    ];

    const accounts = [
        {
            id: 'acc_1',
            name: 'Primary Checking Account',
            accountNumber: '•••• 8812',
            routing: 'APEX04291',
            balance: 18430.00,
            type: 'Everyday Spending'
        },
        {
            id: 'acc_2',
            name: 'High-Yield Savings Vault',
            accountNumber: '•••• 3901',
            routing: 'APEX04291',
            balance: 6420.75,
            type: '7.2% APY Compounded Daily'
        },
        {
            id: 'acc_3',
            name: 'Global Multi-Currency (EUR)',
            accountNumber: '•••• 9901',
            routing: 'SEPA-APEX01',
            balance: 3250.00,
            type: 'Euro Treasury'
        }
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const currentCard = cards[activeCardIndex];

    return (
        <div className="mobile-screen-content animate-fade-in">
            <div className="flex-between">
                <span className="section-heading">My Virtual & Physical Cards</span>
                <span className="caption-label">{activeCardIndex + 1} of {cards.length}</span>
            </div>

            {/* Horizontal Swipeable Blue Card */}
            <div className="cards-slider-wrap mt-3">
                <div
                    className={`mobile-bank-card ${isFrozen ? 'card-locked' : ''}`}
                    style={{ background: currentCard.bg }}
                >
                    <div className="card-header-row">
                        <div className="card-brand-tag">
                            <Sparkles size={14} color="#FFFFFF" />
                            <span>{currentCard.tier}</span>
                        </div>
                        <div className="card-network-row">
                            <Wifi size={18} color="#FFFFFF" />
                            <span className="card-network-text">{currentCard.type}</span>
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
                        {currentCard.number}
                    </div>

                    <div className="card-foot-row">
                        <div>
                            <span className="card-label-xs">CARD HOLDER</span>
                            <span className="card-value-sm">{currentCard.holder}</span>
                        </div>
                        <div className="text-right">
                            <span className="card-label-xs">EXPIRES</span>
                            <span className="card-value-sm">{currentCard.expiry}</span>
                        </div>
                    </div>
                </div>

                {/* Card Slider Dots */}
                <div className="slider-dots mt-2">
                    {cards.map((_, i) => (
                        <button
                            key={i}
                            className={`slider-dot ${i === activeCardIndex ? 'active' : ''}`}
                            onClick={() => setActiveCardIndex(i)}
                            aria-label={`Card ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Card Action Buttons (Blue Icons on White Cards) */}
            <div className="card-actions-grid mt-3">
                <button
                    className={`card-action-btn ${isFrozen ? 'active-freeze' : ''}`}
                    onClick={() => setIsFrozen(!isFrozen)}
                >
                    {isFrozen ? <Unlock size={18} color="#1E5EFF" /> : <Lock size={18} color="#1E5EFF" />}
                    <span>{isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
                </button>

                <button
                    className="card-action-btn"
                    onClick={() => setShowCVV(!showCVV)}
                >
                    {showCVV ? <EyeOff size={18} color="#1E5EFF" /> : <Eye size={18} color="#1E5EFF" />}
                    <span>{showCVV ? `CVV: ${currentCard.cvv}` : 'Show Details'}</span>
                </button>

                <button className="card-action-btn">
                    <Sliders size={18} color="#1E5EFF" />
                    <span>Set Limits</span>
                </button>

                <button className="card-action-btn">
                    <Settings size={18} color="#1E5EFF" />
                    <span>Manage PIN</span>
                </button>
            </div>

            {/* Accounts Details List */}
            <div className="mt-4">
                <span className="section-heading">Connected Bank Accounts</span>

                <div className="accounts-list-wrap mt-2">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="card-clean account-list-item">
                            <div className="flex-between">
                                <div>
                                    <span className="body-text font-medium text-heading">{acc.name}</span>
                                    <p className="caption-label">{acc.type}</p>
                                </div>
                                <span className="balance-amount text-lg tabular-nums">
                                    ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="divider-line" />

                            <div className="flex-between font-xs">
                                <span className="text-secondary">Account: {acc.accountNumber}</span>
                                <div
                                    className="copy-btn-inline"
                                    onClick={() => handleCopy(acc.accountNumber, acc.id)}
                                >
                                    <span>Routing: {acc.routing}</span>
                                    {copiedId === acc.id ? <Check size={12} color="#16A34A" /> : <Copy size={12} color="#6B7280" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountsCardsScreen;
