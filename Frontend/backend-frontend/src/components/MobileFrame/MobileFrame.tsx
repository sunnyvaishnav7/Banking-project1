import React, { useState, ReactNode } from 'react';
import { Smartphone, Monitor, Sparkles, Shield, Wifi, Battery, Signal } from 'lucide-react';
import './MobileFrame.css';

interface MobileFrameProps {
    children: ReactNode;
    activeScreenId: string;
    onSelectScreen: (screenId: string) => void;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children, activeScreenId, onSelectScreen }) => {
    const [isPhoneFrame, setIsPhoneFrame] = useState(true);

    const screens = [
        { id: 'home', label: 'Home' },
        { id: 'assistant', label: 'AI Assistant' },
        { id: 'cards', label: 'Cards' },
        { id: 'transfers', label: 'Send Money' },
        { id: 'transactions', label: 'History' },
        { id: 'settings', label: 'Settings' },
        { id: 'components', label: 'Style Guide' },
        { id: 'login', label: 'Login' }
    ];

    return (
        <div className="mobile-app-wrapper">
            {/* Top Desktop Showcase / Presentation Control Bar */}
            <div className="desktop-toolbar">
                <div className="toolbar-brand">
                    <div className="toolbar-logo">
                        <Shield size={18} color="#FFFFFF" />
                    </div>
                    <div>
                        <span className="toolbar-title">Apex Mobile Banking</span>
                        <span className="toolbar-sub">Conversation-First ChatGPT Architecture</span>
                    </div>
                </div>

                {/* Quick Jump Screen Selector */}
                <div className="screen-picker-pills">
                    {screens.map((s) => (
                        <button
                            key={s.id}
                            className={`screen-pill-btn ${activeScreenId === s.id ? 'active' : ''}`}
                            onClick={() => onSelectScreen(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Frame Mode Toggle */}
                <div className="frame-mode-toggle">
                    <button
                        className={`frame-btn ${isPhoneFrame ? 'active' : ''}`}
                        onClick={() => setIsPhoneFrame(true)}
                        title="View in 390x844 iPhone Viewport"
                    >
                        <Smartphone size={16} />
                        <span>390×844</span>
                    </button>
                    <button
                        className={`frame-btn ${!isPhoneFrame ? 'active' : ''}`}
                        onClick={() => setIsPhoneFrame(false)}
                        title="View in Responsive Screen"
                    >
                        <Monitor size={16} />
                        <span>Full</span>
                    </button>
                </div>
            </div>

            {/* Mobile Viewport Container */}
            <div className="mobile-canvas-container">
                <div className={`mobile-device-shell ${isPhoneFrame ? 'phone-frame' : 'responsive-frame'}`}>
                    {/* iOS Status Bar */}
                    <div className="ios-status-bar">
                        <span className="status-time">9:41</span>
                        <div className="dynamic-island">
                            <div className="island-camera" />
                        </div>
                        <div className="status-icons">
                            <Signal size={14} color="#0B0B0B" />
                            <Wifi size={14} color="#0B0B0B" />
                            <Battery size={16} color="#0B0B0B" />
                        </div>
                    </div>

                    {/* App Core Screen Frame (390x844 Scrollable Content) */}
                    <div className="mobile-viewport-body">
                        {children}
                    </div>

                    {/* iOS Home Indicator Bar */}
                    <div className="ios-home-bar-wrap">
                        <div className="ios-home-indicator" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileFrame;
