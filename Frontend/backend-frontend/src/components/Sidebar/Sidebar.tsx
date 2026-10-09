import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Wallet,
    Send,
    ReceiptText,
    PieChart,
    Settings,
    LogOut,
    Sparkles,
    Shield,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
    const { logout, isDemo, toggleDemoMode } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/accounts', label: 'Accounts & Cards', icon: Wallet, badge: 'Active' },
        { path: '/transfer', label: 'Send & Transfer', icon: Send },
        { path: '/transactions', label: 'Transactions', icon: ReceiptText },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`app-sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo-icon">
                    <Shield size={24} className="shield-icon" />
                    <Sparkles size={14} className="sparkle-accent" />
                </div>
                {!collapsed && (
                    <div className="brand-text">
                        <span className="brand-title">ApexBank</span>
                        <span className="brand-sub">Fintech Prime</span>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav" aria-label="Main Navigation">
                <div className="nav-section-label">{!collapsed && 'Core Banking'}</div>
                <ul className="nav-menu">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <div className="nav-icon-box">
                                        <Icon size={20} />
                                    </div>
                                    {!collapsed && <span className="nav-label">{item.label}</span>}
                                    {!collapsed && item.badge && (
                                        <span className="nav-badge">{item.badge}</span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Footer Section */}
            <div className="sidebar-footer">
                {/* Demo / Live Mode Switch */}
                <div
                    className="sandbox-toggle-box"
                    onClick={() => toggleDemoMode(!isDemo)}
                    role="button"
                    tabIndex={0}
                    title="Toggle between Interactive Sandbox & Live Server"
                >
                    <div className="sandbox-info">
                        {!collapsed && <span className="sandbox-title">Sandbox Demo</span>}
                        {!collapsed && (
                            <span className="sandbox-sub">{isDemo ? 'Interactive Mock' : 'Live Engine'}</span>
                        )}
                    </div>
                    {isDemo ? <ToggleRight size={26} className="text-emerald" /> : <ToggleLeft size={26} className="text-secondary" />}
                </div>

                {/* Logout Button */}
                <button
                    className="btn-ghost logout-btn"
                    onClick={() => logout()}
                    title={collapsed ? 'Sign Out' : undefined}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;