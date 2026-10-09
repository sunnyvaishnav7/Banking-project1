import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BankAccount } from '../../types';
import {
    Wallet,
    Building,
    Plus,
    Copy,
    Check,
    Send,
    ArrowDownCircle,
    ShieldCheck,
    Globe,
    ExternalLink,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import './AccountsPage.css';

interface AccountsPageProps {
    onOpenNewAccountModal: () => void;
    onOpenDepositModal: () => void;
    onOpenSendModalWithAccount: (accId: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({
    onOpenNewAccountModal,
    onOpenDepositModal,
    onOpenSendModalWithAccount
}) => {
    const { accounts, refreshAccounts, isPrivacyEnabled } = useAuth();
    const { showToast } = useToast();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        showToast('Account ID copied to clipboard for wire transfers', 'info');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshAccounts();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const getFlag = (currency: string) => {
        switch (currency) {
            case 'INR': return '🇮🇳';
            case 'USD': return '🇺🇸';
            case 'EUR': return '🇪🇺';
            case 'GBP': return '🇬🇧';
            case 'AED': return '🇦🇪';
            case 'JPY': return '🇯🇵';
            default: return '🌐';
        }
    };

    return (
        <div className="accounts-page animate-fade-in">
            {/* Page Header */}
            <div className="page-header-row">
                <div>
                    <h1>Bank Accounts & Treasury</h1>
                    <p className="page-sub">
                        Institutional multi-currency ledger accounts with real-time settlement and segregated reserves.
                    </p>
                </div>
                <div className="page-actions-row">
                    <button
                        className="btn-secondary btn-sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        <span>Refresh Balances</span>
                    </button>
                    <button className="btn-primary btn-sm" onClick={onOpenNewAccountModal}>
                        <Plus size={16} />
                        <span>Open New Account</span>
                    </button>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="accounts-grid">
                {accounts.map((acc) => {
                    const flag = getFlag(acc.currency);

                    return (
                        <div key={acc._id} className="account-card glass-card">
                            <div className="account-card-top">
                                <div className="account-currency-badge">
                                    <span className="currency-flag-lg">{flag}</span>
                                    <div>
                                        <h3 className="account-name">{acc.currency} {acc.accountType || 'Treasury'}</h3>
                                        <span className="account-number-sub amount-mono">
                                            Account: {acc.accountNumber || `•••• ${acc._id.slice(-4)}`}
                                        </span>
                                    </div>
                                </div>
                                <span className="badge badge-success">
                                    <ShieldCheck size={13} /> {acc.status}
                                </span>
                            </div>

                            <div className="account-balance-section">
                                <span className="balance-label">AVAILABLE LIQUID BALANCE</span>
                                <div className="balance-display amount-mono">
                                    {isPrivacyEnabled ? '••••••••' : `${acc.currency} ${(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </div>
                            </div>

                            {/* Account Details Box */}
                            <div className="account-details-box">
                                <div className="detail-row">
                                    <span className="detail-label">MongoDB Account ID</span>
                                    <div
                                        className="detail-copyable"
                                        onClick={() => handleCopy(acc._id, acc._id)}
                                        title="Click to copy exact Account ID for API transactions"
                                    >
                                        <span className="amount-mono font-xs">{acc._id}</span>
                                        {copiedId === acc._id ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Routing / SWIFT Code</span>
                                    <span className="amount-mono">APEXINBB042</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Ledger Protocol</span>
                                    <span className="badge badge-neutral">ACID Serialized</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="account-card-actions">
                                <button
                                    className="btn-primary btn-sm flex-1"
                                    onClick={() => onOpenSendModalWithAccount(acc._id)}
                                >
                                    <Send size={14} />
                                    <span>Send Wire</span>
                                </button>
                                <button
                                    className="btn-secondary btn-sm flex-1"
                                    onClick={onOpenDepositModal}
                                >
                                    <ArrowDownCircle size={14} />
                                    <span>Deposit</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Account Card CTA */}
                <div className="add-account-cta-card glass-card" onClick={onOpenNewAccountModal}>
                    <div className="add-cta-icon">
                        <Plus size={28} />
                    </div>
                    <h3>Open Additional Currency Account</h3>
                    <p>Instant provisioning for USD, EUR, GBP, AED with zero FX markup.</p>
                    <button className="btn-secondary btn-sm mt-3">
                        <Sparkles size={14} />
                        <span>Explore Currencies</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;
