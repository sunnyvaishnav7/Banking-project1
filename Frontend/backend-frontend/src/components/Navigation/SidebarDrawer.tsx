import React from 'react';
import {
    Plus,
    Search,
    Home,
    Wallet,
    CreditCard,
    Send,
    FileText,
    TrendingUp,
    Shield,
    Settings,
    HelpCircle,
    LogOut,
    Sparkles,
    Palette,
    X
} from 'lucide-react';
import './SidebarDrawer.css';

interface SidebarDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onSelectTab: (tab: string) => void;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    onLogout?: () => void;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
    isOpen,
    onClose,
    activeTab,
    onSelectTab,
    userName = 'Alexander Wright',
    userEmail = 'alex.wright@apexbank.io',
    userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    onLogout
}) => {
    if (!isOpen) return null;

    const quickLinks = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'accounts', label: 'Accounts', icon: Wallet },
        { id: 'cards', label: 'Cards', icon: CreditCard },
        { id: 'transfers', label: 'Transfers', icon: Send },
        { id: 'transactions', label: 'Transactions & Statements', icon: FileText },
        { id: 'investments', label: 'Investments & Wealth', icon: TrendingUp },
        { id: 'components', label: 'Component Library & Styles', icon: Palette },
    ];

    const recentActivities = [
        { id: 'act_1', title: 'Sent $200.00 to Alex', time: '2h ago' },
        { id: 'act_2', title: 'Electricity bill paid ($84.50)', time: 'Yesterday' },
        { id: 'act_3', title: 'Card freeze request (Obsidian)', time: '3d ago' },
        { id: 'act_4', title: 'Checking balance inquiry', time: '5d ago' },
    ];

    const handleSelect = (tabId: string) => {
        onSelectTab(tabId);
        onClose();
    };

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <aside
                className="drawer-panel animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                aria-label="Navigation Drawer"
            >
                {/* Header with "+ Ask Assistant" Button */}
                <div className="drawer-header">
                    <button
                        className="btn-new-chat"
                        onClick={() => handleSelect('assistant')}
                    >
                        <Sparkles size={18} />
                        <span>Ask Assistant</span>
                    </button>
                    <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">
                        <X size={20} color="#6B7280" />
                    </button>
                </div>

                {/* Search Box */}
                <div className="drawer-search-wrap">
                    <Search size={16} className="drawer-search-icon" color="#6B7280" />
                    <input
                        type="text"
                        placeholder="Search transactions, payees..."
                        className="drawer-search-input"
                    />
                </div>

                {/* Navigation Sections */}
                <div className="drawer-scrollable">
                    {/* Quick Links */}
                    <div className="drawer-section">
                        <span className="drawer-section-title">QUICK LINKS</span>
                        <ul className="drawer-nav-list">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;

                                return (
                                    <li key={item.id}>
                                        <button
                                            className={`drawer-nav-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => handleSelect(item.id)}
                                        >
                                            <Icon
                                                size={19}
                                                color={isActive ? '#1E5EFF' : '#1A1A1A'}
                                                strokeWidth={1.8}
                                            />
                                            <span>{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Recent Activity (like ChatGPT History) */}
                    <div className="drawer-section">
                        <span className="drawer-section-title">RECENT ACTIVITY</span>
                        <ul className="drawer-activity-list">
                            {recentActivities.map((act) => (
                                <li key={act.id}>
                                    <button
                                        className="drawer-activity-btn"
                                        onClick={() => handleSelect('transactions')}
                                    >
                                        <span className="activity-title">{act.title}</span>
                                        <span className="activity-time">{act.time}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom User Profile Section */}
                <div className="drawer-footer">
                    <button
                        className="drawer-user-row"
                        onClick={() => handleSelect('settings')}
                    >
                        <img src={userAvatar} alt={userName} className="drawer-avatar" />
                        <div className="drawer-user-info">
                            <span className="drawer-user-name">{userName}</span>
                            <span className="drawer-user-tier">Apex Premier Tier</span>
                        </div>
                        <Settings size={18} color="#6B7280" />
                    </button>

                    {onLogout && (
                        <button className="drawer-logout-btn" onClick={onLogout}>
                            <LogOut size={16} color="#DC2626" />
                            <span>Sign Out</span>
                        </button>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default SidebarDrawer;
