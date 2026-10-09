import React from 'react';
import { Home, CreditCard, Send, Sparkles } from 'lucide-react';
import './BottomNav.css';

interface BottomNavProps {
    activeTab: string;
    onSelectTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'cards', label: 'Cards', icon: CreditCard },
        { id: 'transfers', label: 'Transfers', icon: Send },
        { id: 'assistant', label: 'Assistant', icon: Sparkles },
    ];

    return (
        <nav className="mobile-bottom-nav" aria-label="Bottom Navigation">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => onSelectTab(tab.id)}
                    >
                        <div className="bottom-nav-icon-wrap">
                            <Icon
                                size={22}
                                color={isActive ? '#1E5EFF' : '#6B7280'}
                                strokeWidth={isActive ? 2.2 : 1.8}
                            />
                        </div>
                        <span className={`bottom-nav-label ${isActive ? 'active' : ''}`}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
