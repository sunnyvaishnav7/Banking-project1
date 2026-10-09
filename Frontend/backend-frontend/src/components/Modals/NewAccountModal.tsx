import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CurrencyType } from '../../types';
import { X, Building, Check, Sparkles, Globe, Shield } from 'lucide-react';
import './Modals.css';

interface NewAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose }) => {
    const { createAccount } = useAuth();
    const { showToast } = useToast();

    const [currency, setCurrency] = useState<CurrencyType>('INR');
    const [accountType, setAccountType] = useState<string>('High-Yield Savings');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const currencies: { code: CurrencyType; name: string; symbol: string; desc: string; icon: string }[] = [
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', desc: 'Domestic Savings & UPI Fast-Pay', icon: '🇮🇳' },
        { code: 'USD', name: 'US Dollar', symbol: '$', desc: 'Global Commercial & Wall St Clearing', icon: '🇺🇸' },
        { code: 'EUR', name: 'Euro', symbol: '€', desc: 'SEPA Direct & European Transfers', icon: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', desc: 'Faster Payments & UK Sterling Vault', icon: '🇬🇧' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', desc: 'Dubai International Financial Centre', icon: '🇦🇪' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', desc: 'Asia-Pacific Settlement Hub', icon: '🇯🇵' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await createAccount(currency);
        setIsSubmitting(false);

        if (result) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-wrap">
                        <div className="modal-icon-badge account-badge">
                            <Building size={18} />
                        </div>
                        <div>
                            <h3>Open New Bank Account</h3>
                            <p className="modal-sub">Multi-currency institutional account with instant IBAN</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {/* Currency Selector Grid */}
                        <div className="input-group">
                            <label className="input-label">Select Denomination & Currency</label>
                            <div className="currencies-grid">
                                {currencies.map((curr) => (
                                    <div
                                        key={curr.code}
                                        className={`currency-card-choice ${currency === curr.code ? 'active' : ''}`}
                                        onClick={() => setCurrency(curr.code)}
                                    >
                                        <div className="currency-card-top">
                                            <span className="currency-flag">{curr.icon}</span>
                                            <span className="currency-code">{curr.code}</span>
                                        </div>
                                        <div className="currency-name">{curr.name}</div>
                                        <div className="currency-desc">{curr.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Account Tier Choice */}
                        <div className="input-group mt-3">
                            <label className="input-label">Account Archetype</label>
                            <div className="account-archetypes">
                                {[
                                    { title: 'High-Yield Savings', rate: '7.2% APY', desc: 'Compounded daily with zero lock-in' },
                                    { title: 'Global Checking', rate: 'Zero Fee', desc: 'Unlimited wires & virtual debit card' },
                                    { title: 'Treasury Investment', rate: 'Prime + 2%', desc: 'Automated portfolio swept balance' }
                                ].map((type) => (
                                    <div
                                        key={type.title}
                                        className={`archetype-item ${accountType === type.title ? 'active' : ''}`}
                                        onClick={() => setAccountType(type.title)}
                                    >
                                        <div className="archetype-header">
                                            <span className="archetype-title">{type.title}</span>
                                            <span className="badge badge-success">{type.rate}</span>
                                        </div>
                                        <p className="archetype-desc">{type.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="security-guarantee-box">
                            <Shield size={16} className="text-emerald" />
                            <span>Zero opening fee &bull; Instant routing number &bull; FDIC/RBI Equivalent Insured</span>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary btn-lg w-full mt-4"
                            disabled={isSubmitting}
                        >
                            <Sparkles size={18} />
                            <span>{isSubmitting ? 'Provisioning Account...' : `Activate ${currency} Bank Account`}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewAccountModal;
