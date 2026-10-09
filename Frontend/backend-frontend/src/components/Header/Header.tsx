import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    Bell,
    Eye,
    EyeOff,
    Sun,
    Moon,
    Send,
    PlusCircle,
    ShieldCheck,
    Wifi,
    WifiOff,
    Check
} from 'lucide-react';
import './Header.css';

interface HeaderProps {
    onOpenSendModal: () => void;
    onOpenDepositModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSendModal, onOpenDepositModal }) => {
    const {
        user,
        isBackendOnline,
        isDemo,
        isPrivacyEnabled,
        togglePrivacy,
        theme,
        toggleTheme,
        accounts
    } = useAuth();

    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const notifications = [
        { id: '1', title: 'Salary Credited', time: '10m ago', text: 'Apex Payroll deposited ₹85,000 into Savings', unread: true },
        { id: '2', title: 'Virtual Card Active', time: '1h ago', text: 'Cyber Neon Mastercard is ready for Apple Pay', unread: true },
        { id: '3', title: 'Security Audit Passed', time: '1d ago', text: 'Biometric 2FA hardware key verified', unread: false }
    ];

    return (
        <header className="app-header glass-panel">
            <div className="header-left">
                {/* Search Bar */}
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search transactions, accounts, payees... (Ctrl+K)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Status Pills */}
                <div className="status-pills">
                    {isDemo ? (
                        <span className="badge badge-warning" title="Running in interactive sandbox mode">
                            <span className="pulse-dot warning"></span> Sandbox Mode
                        </span>
                    ) : isBackendOnline ? (
                        <span className="badge badge-success" title="Connected to ApexBank Live Backend">
                            <Wifi size={13} /> Live Core Engine
                        </span>
                    ) : (
                        <span className="badge badge-danger" title="Backend is offline or reconnecting">
                            <WifiOff size={13} /> Server Offline
                        </span>
                    )}

                    <span className="badge badge-info hide-on-mobile">
                        <ShieldCheck size={13} /> 256-Bit Encrypted
                    </span>
                </div>
            </div>

            <div className="header-right">
                {/* Quick Action Buttons */}
                <button className="btn-primary btn-sm header-action-btn" onClick={onOpenSendModal}>
                    <Send size={15} />
                    <span>Send Money</span>
                </button>

                <button className="btn-secondary btn-sm header-action-btn hide-on-mobile" onClick={onOpenDepositModal}>
                    <PlusCircle size={15} />
                    <span>Top-Up</span>
                </button>

                {/* Privacy Balance Toggle */}
                <button
                    className="header-icon-btn"
                    onClick={togglePrivacy}
                    title={isPrivacyEnabled ? 'Unhide balances' : 'Hide sensitive balances'}
                    aria-label="Toggle balance privacy"
                >
                    {isPrivacyEnabled ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {/* Theme Toggle */}
                <button
                    className="header-icon-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications Dropdown */}
                <div className="notification-wrapper">
                    <button
                        className="header-icon-btn relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                        <span className="notification-badge">2</span>
                    </button>

                    {showNotifications && (
                        <div className="notifications-popover glass-card animate-fade-in">
                            <div className="notif-header">
                                <h4>Notifications</h4>
                                <span className="notif-mark-read"><Check size={14} /> Mark all read</span>
                            </div>
                            <div className="notif-list">
                                {notifications.map((n) => (
                                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                                        <div className="notif-item-top">
                                            <span className="notif-item-title">{n.title}</span>
                                            <span className="notif-time">{n.time}</span>
                                        </div>
                                        <p className="notif-desc">{n.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Mini Profile */}
                <div className="user-profile-badge">
                    <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={user?.name || 'User Avatar'}
                        className="user-avatar"
                    />
                    <div className="user-details hide-on-mobile">
                        <span className="user-name">{user?.name || 'Alexander Wright'}</span>
                        <span className="user-tier">Apex Premier Tier</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;