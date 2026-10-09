import React, { useState } from 'react';
import {
    User,
    Shield,
    Fingerprint,
    Lock,
    Bell,
    Globe,
    HelpCircle,
    LogOut,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import './MobileScreens.css';

interface ProfileSettingsScreenProps {
    onLogout?: () => void;
}

const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ onLogout }) => {
    const [faceIdEnabled, setFaceIdEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    return (
        <div className="mobile-screen-content animate-fade-in">
            {/* User Profile Card */}
            <div className="card-clean profile-header-card">
                <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    alt="User Avatar"
                    className="profile-avatar-lg"
                />
                <h2 className="screen-title mt-2">Alexander Wright</h2>
                <span className="caption-label">alex.wright@apexbank.io</span>
                <span className="chip-pill mt-2">
                    <Sparkles size={13} color="#1E5EFF" />
                    <span>Apex Premier Member</span>
                </span>
            </div>

            {/* Group 1: Security & Credentials */}
            <div className="settings-group mt-4">
                <span className="caption-label font-medium mb-2 block">SECURITY & AUTHENTICATION</span>
                <div className="card-clean p-0 overflow-hidden">
                    <div className="setting-row-item has-divider">
                        <div className="setting-row-left">
                            <Fingerprint size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">Face ID / Biometrics</span>
                                <p className="caption-label">Instant authentication</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={faceIdEnabled}
                                onChange={(e) => setFaceIdEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-row-item has-divider">
                        <div className="setting-row-left">
                            <Shield size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">Two-Factor Auth (2FA)</span>
                                <p className="caption-label">Hardware passkey required</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={twoFactorEnabled}
                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-row-item">
                        <div className="setting-row-left">
                            <Lock size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">Change Transfer PIN</span>
                                <p className="caption-label">Last updated 3 months ago</p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#6B7280" />
                    </div>
                </div>
            </div>

            {/* Group 2: Preferences */}
            <div className="settings-group mt-4">
                <span className="caption-label font-medium mb-2 block">PREFERENCES & SUPPORT</span>
                <div className="card-clean p-0 overflow-hidden">
                    <div className="setting-row-item has-divider">
                        <div className="setting-row-left">
                            <Bell size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">Push Notifications</span>
                                <p className="caption-label">Real-time debit/credit alerts</p>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-row-item has-divider">
                        <div className="setting-row-left">
                            <Globe size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">App Language</span>
                                <p className="caption-label">English (US)</p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#6B7280" />
                    </div>

                    <div className="setting-row-item">
                        <div className="setting-row-left">
                            <HelpCircle size={19} color="#1E5EFF" />
                            <div>
                                <span className="body-text font-medium text-heading">Help & Concierge</span>
                                <p className="caption-label">24/7 Priority Banking Support</p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#6B7280" />
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="mt-4 mb-4">
                <button
                    className="btn-secondary w-full text-error"
                    onClick={onLogout}
                >
                    <LogOut size={16} color="#DC2626" />
                    <span style={{ color: '#DC2626' }}>Sign Out from Device</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSettingsScreen;
