import React, { useState, ReactNode } from 'react';
import {
    Shield,
    Sparkles,
    Search,
    Home,
    Wallet,
    CreditCard,
    Send,
    FileText,
    TrendingUp,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Bell,
    Check,
    Palette
} from 'lucide-react';
import '../../pages/Desktop/DesktopStyles.css';

interface DesktopLayoutProps {
    activeTab: string;
    onSelectTab: (tab: string) => void;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    onLogout?: () => void;
    children: ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
    activeTab,
    onSelectTab,
    userName = 'Alexander Wright',
    userEmail = 'alex.wright@apexbank.io',
    userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    onLogout,
    children
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const quickLinks = [
        { id: 'home', label: 'Home Dashboard', icon: Home },
        { id: 'assistant', label: 'AI Banking Assistant', icon: Sparkles, badge: 'AI' },
        { id: 'cards', label: 'Accounts & Cards', icon: CreditCard },
        { id: 'transfers', label: 'Send & Wire Transfers', icon: Send },
        { id: 'transactions', label: 'Statements & Ledger', icon: FileText },
        { id: 'settings', label: 'Security & Settings', icon: Settings },
        { id: 'components', label: 'Component Library', icon: Palette },
    ];

    const recentActivities = [
        { id: 'act_1', title: 'Sent $200 to Alex', time: '2h ago' },
        { id: 'act_2', title: 'Electricity bill paid ($84.50)', time: 'Yesterday' },
        { id: 'act_3', title: 'Card freeze request (Obsidian)', time: '3d ago' },
        { id: 'act_4', title: 'Monthly balance check', time: '5d ago' },
    ];

    const getScreenHeading = () => {
        switch (activeTab) {
            case 'home': return 'Home & Wealth Dashboard';
            case 'assistant': return 'AI Banking Assistant';
            case 'cards': return 'Bank Accounts & Smart Cards';
            case 'transfers': return 'Instant Wire Transfer Terminal';
            case 'transactions': return 'Statements & Ledger Audit';
            case 'settings': return 'Security & Account Governance';
            case 'components': return 'Design System Style Guide';
            default: return 'Apex Desktop';
        }
    };

    return (
        <div className="desktop-app-container">
            {/* Left Sidebar (ChatGPT-Style) */}
            <aside className={`desktop-sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="desktop-sidebar-top">
                    <div className="sidebar-brand-row">
                        <div className="sidebar-brand-left">
                            <div className="sidebar-logo-icon">
                                <Shield size={20} color="#FFFFFF" strokeWidth={2.2} />
                            </div>
                            {!collapsed && (
                                <div className="sidebar-brand-text">
                                    <span className="sidebar-brand-name">ApexBank</span>
                                    <span className="sidebar-brand-tag">Desktop Suite</span>
                                </div>
                            )}
                        </div>

                        <button
                            className="sidebar-collapse-toggle"
                            onClick={() => setCollapsed(!collapsed)}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-label="Toggle sidebar"
                        >
                            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>
                    </div>

                    {/* "+ Ask Assistant" Button */}
                    {!collapsed ? (
                        <button
                            className="btn-sidebar-new"
                            onClick={() => onSelectTab('assistant')}
                        >
                            <Sparkles size={16} />
                            <span>Ask Assistant</span>
                        </button>
                    ) : (
                        <button
                            className="btn-sidebar-new p-0"
                            onClick={() => onSelectTab('assistant')}
                            title="Ask Assistant"
                        >
                            <Sparkles size={18} />
                        </button>
                    )}

                    {/* Search Field */}
                    {!collapsed && (
                        <div className="sidebar-search-box">
                            <Search size={15} className="sidebar-search-icon" color="#6B7280" />
                            <input
                                type="text"
                                placeholder="Search payees, cards..."
                                className="sidebar-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Nav Menu */}
                <div className="desktop-sidebar-scroll">
                    <div>
                        {!collapsed && <span className="sidebar-nav-section-title">QUICK NAVIGATION</span>}
                        <ul className="sidebar-nav-menu">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;

                                return (
                                    <li key={item.id}>
                                        <button
                                            className={`sidebar-nav-item-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => onSelectTab(item.id)}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <Icon
                                                size={19}
                                                color={isActive ? '#1E5EFF' : '#1A1A1A'}
                                                strokeWidth={1.8}
                                            />
                                            {!collapsed && <span>{item.label}</span>}
                                            {!collapsed && item.badge && (
                                                <span className="chip-pill font-xs p-1 ml-auto">{item.badge}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {!collapsed && (
                        <div>
                            <span className="sidebar-nav-section-title">RECENT ACTIVITY</span>
                            <ul className="sidebar-activity-menu">
                                {recentActivities.map((act) => (
                                    <li key={act.id}>
                                        <button
                                            className="sidebar-activity-item"
                                            onClick={() => onSelectTab('transactions')}
                                        >
                                            <span className="activity-text-ellipsis">{act.title}</span>
                                            <span className="caption-label font-xs">{act.time}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer User Profile */}
                <div className="desktop-sidebar-footer">
                    <button
                        className="sidebar-user-btn"
                        onClick={() => onSelectTab('settings')}
                        title={collapsed ? userName : undefined}
                    >
                        <img src={userAvatar} alt={userName} className="sidebar-user-avatar" />
                        {!collapsed && (
                            <div className="sidebar-user-details">
                                <span className="sidebar-user-name">{userName}</span>
                                <span className="sidebar-user-tier">Apex Premier</span>
                            </div>
                        )}
                    </button>

                    {!collapsed && onLogout && (
                        <button
                            className="header-icon-circle-btn"
                            onClick={onLogout}
                            title="Sign Out"
                            aria-label="Sign Out"
                        >
                            <LogOut size={16} color="#DC2626" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Desktop Main Column */}
            <div className="desktop-main-column">
                {/* Desktop Top Header */}
                <header className="desktop-top-header">
                    <div className="desktop-header-left">
                        <h1 className="desktop-header-title">{getScreenHeading()}</h1>
                    </div>

                    <div className="desktop-header-right">
                        <span className="header-status-tag">
                            <Shield size={14} /> 256-Bit Encrypted
                        </span>

                        <button
                            className="btn-primary"
                            style={{ height: '40px', width: 'auto', padding: '0 16px', fontSize: '13px' }}
                            onClick={() => onSelectTab('transfers')}
                        >
                            <Send size={15} />
                            <span>Send Money</span>
                        </button>

                        <button
                            className="header-icon-circle-btn"
                            onClick={() => onSelectTab('transactions')}
                            aria-label="Notifications"
                        >
                            <Bell size={18} color="#0B0B0B" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="desktop-content-area animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DesktopLayout;
