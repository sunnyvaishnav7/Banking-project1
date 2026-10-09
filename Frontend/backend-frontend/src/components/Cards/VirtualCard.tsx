import React, { useState } from 'react';
import { VirtualCardData } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
    Copy,
    Check,
    Eye,
    EyeOff,
    RotateCw,
    Lock,
    Unlock,
    Wifi,
    Sparkles
} from 'lucide-react';
import './VirtualCard.css';

interface VirtualCardProps {
    card: VirtualCardData;
    onToggleFreeze?: (cardId: string) => void;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ card, onToggleFreeze }) => {
    const { showToast } = useToast();
    const [isFlipped, setIsFlipped] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showCVV, setShowCVV] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(card.cardNumber.replace(/\s+/g, ''));
        setCopied(true);
        showToast('Card number copied to clipboard', 'info');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleFreeze = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFreeze) {
            onToggleFreeze(card.id);
        }
        showToast(
            card.isFrozen ? 'Card has been unfrozen for transactions' : 'Card temporarily frozen for security',
            card.isFrozen ? 'success' : 'warning',
            card.isFrozen ? 'Card Unlocked' : 'Card Locked'
        );
    };

    const skinClass = `card-skin-${card.cardTier.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="virtual-card-wrapper">
            <div
                className={`card-3d-inner ${isFlipped ? 'flipped' : ''} ${card.isFrozen ? 'frozen' : ''} ${skinClass}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front of the Card */}
                <div className="card-face card-front">
                    <div className="card-top-row">
                        <div className="card-brand-tag">
                            <Sparkles size={14} className="gold-icon" />
                            <span>{card.cardTier}</span>
                        </div>
                        <div className="card-network-row">
                            <Wifi size={18} className="contactless-icon" />
                            <span className="card-network-name">{card.type}</span>
                        </div>
                    </div>

                    <div className="card-chip-row">
                        <div className="smart-chip">
                            <div className="chip-line"></div>
                            <div className="chip-line"></div>
                        </div>
                        {card.isFrozen && (
                            <span className="frozen-badge">
                                <Lock size={12} /> FROZEN
                            </span>
                        )}
                    </div>

                    <div className="card-number-row" onClick={handleCopy} title="Click to copy number">
                        <span className="card-number-text">{card.cardNumber}</span>
                        <button className="copy-num-btn" aria-label="Copy card number">
                            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="card-bottom-row">
                        <div className="card-holder-group">
                            <span className="card-field-label">CARD HOLDER</span>
                            <span className="card-holder-name">{card.cardHolder}</span>
                        </div>
                        <div className="card-expiry-group">
                            <span className="card-field-label">EXPIRES</span>
                            <span className="card-expiry-date">{card.expiry}</span>
                        </div>
                    </div>
                </div>

                {/* Back of the Card */}
                <div className="card-face card-back">
                    <div className="mag-stripe"></div>
                    <div className="signature-cvv-row">
                        <div className="signature-strip">Authorized Signature</div>
                        <div className="cvv-box" onClick={(e) => { e.stopPropagation(); setShowCVV(!showCVV); }}>
                            <span className="cvv-label">CVV</span>
                            <span className="cvv-code">{showCVV ? card.cvv : '•••'}</span>
                            {showCVV ? <EyeOff size={12} /> : <Eye size={12} />}
                        </div>
                    </div>
                    <p className="card-disclaimer">
                        Issued by ApexBank International N.A. under institutional license. For support visit apexbank.io
                    </p>
                </div>
            </div>

            {/* Quick Card Controls Underneath */}
            <div className="card-quick-actions">
                <button
                    className={`btn-secondary btn-sm ${card.isFrozen ? 'active-locked' : ''}`}
                    onClick={handleToggleFreeze}
                >
                    {card.isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
                    <span>{card.isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
                </button>

                <button
                    className="btn-ghost btn-sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <RotateCw size={14} />
                    <span>Flip View</span>
                </button>
            </div>
        </div>
    );
};

export default VirtualCard;
