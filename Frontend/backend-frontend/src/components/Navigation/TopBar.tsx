import React from 'react';
import { Menu, Bell } from 'lucide-react';
import './TopBar.css';

interface TopBarProps {
    title: string;
    onOpenDrawer: () => void;
    onOpenProfile: () => void;
    onOpenNotifications?: () => void;
    userAvatar?: string;
    unreadNotifications?: number;
}

const TopBar: React.FC<TopBarProps> = ({
    title,
    onOpenDrawer,
    onOpenProfile,
    onOpenNotifications,
    userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    unreadNotifications = 2
}) => {
    return (
        <header className="mobile-top-bar">
            {/* Left: Hamburger Icon (ChatGPT-style) */}
            <button
                className="top-bar-btn"
                onClick={onOpenDrawer}
                aria-label="Open navigation menu"
            >
                <Menu size={22} color="#0B0B0B" strokeWidth={2} />
            </button>

            {/* Center: App Name / Screen Title */}
            <div className="top-bar-center">
                <span className="top-bar-title">{title}</span>
            </div>

            {/* Right: Notifications Bell & Profile Avatar */}
            <div className="top-bar-right">
                <button
                    className="top-bar-btn relative"
                    onClick={onOpenNotifications || onOpenProfile}
                    aria-label="Notifications"
                >
                    <Bell size={20} color="#0B0B0B" strokeWidth={2} />
                    {unreadNotifications > 0 && (
                        <span className="top-bar-badge" />
                    )}
                </button>

                <button
                    className="avatar-btn"
                    onClick={onOpenProfile}
                    aria-label="User profile"
                >
                    <img src={userAvatar} alt="User Avatar" className="top-avatar-img" />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
