import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { checkBackendHealth } from '../../services/api';
import {
    Settings,
    User,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Sun,
    Moon,
    Activity,
    CheckCircle2,
    XCircle,
    Key,
    Smartphone,
    Globe,
    Bell
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
    const {
        user,
        theme,
        toggleTheme,
        isPrivacyEnabled,
        togglePrivacy,
        isDemo,
        toggleDemoMode,
        isBackendOnline
    } = useAuth();
    const { showToast } = useToast();

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [biometricLogin, setBiometricLogin] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [isPinging, setIsPinging] = useState(false);
    const [pingLatency, setPingLatency] = useState<number | null>(null);

    const handlePingBackend = async () => {
        setIsPinging(true);
        const start = performance.now();
        const alive = await checkBackendHealth();
        const duration = Math.round(performance.now() - start);
        setIsPinging(false);
        setPingLatency(duration);

        if (alive) {
            showToast(`Backend connection healthy (${duration}ms latency)`, 'success', 'Server Online');
        } else {
            showToast('Backend is unreachable. Sandbox Mode is recommended.', 'error', 'Connection Offline');
        }
    };

    const handleSaveSecurity = () => {
        showToast('Security preferences updated successfully', 'success');
    };

    return (
        <div className="settings-page animate-fade-in">
            <div className="page-header-row">
                <div>
                    <h1>Settings & Security Governance</h1>
                    <p className="page-sub">
                        Manage your profile, biometric multi-factor authentication, and system diagnostics.
                    </p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Profile Card */}
                <div className="settings-card glass-card">
                    <div className="section-header">
                        <div className="flex-align-gap">
                            <User size={18} className="text-emerald" />
                            <h3>Personal Profile</h3>
                        </div>
                    </div>

                    <div className="profile-edit-section">
                        <div className="profile-avatar-row">
                            <img
                                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                                alt={user?.name || 'User Avatar'}
                                className="settings-avatar-img"
                            />
                            <div>
                                <h4 className="user-name-title">{user?.name || 'Alexander Wright'}</h4>
                                <p className="text-secondary font-xs">{user?.email || 'alex.wright@apexbank.io'}</p>
                                <span className="badge badge-success mt-1">Apex Premier Member</span>
                            </div>
                        </div>

                        <div className="input-group mt-4">
                            <label className="input-label">Legal Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={user?.name || ''}
                                readOnly
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Registered Email</label>
                            <input
                                type="email"
                                className="input-field"
                                value={user?.email || ''}
                                readOnly
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Unique User ID</label>
                            <input
                                type="text"
                                className="input-field amount-mono"
                                value={user?._id || 'usr_apex_9824'}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="settings-card glass-card">
                    <div className="section-header">
                        <div className="flex-align-gap">
                            <Shield size={18} className="text-emerald" />
                            <h3>Security & Authentication</h3>
                        </div>
                    </div>

                    <div className="settings-toggles-list">
                        <div className="setting-toggle-item">
                            <div>
                                <h4>Hardware 2FA / Passkey</h4>
                                <p className="setting-toggle-sub">Require WebAuthn YubiKey / Touch ID for wire transfers</p>
                            </div>
                            <input
                                type="checkbox"
                                className="custom-switch"
                                checked={twoFactorEnabled}
                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                            />
                        </div>

                        <div className="setting-toggle-item">
                            <div>
                                <h4>Biometric Quick Unlock</h4>
                                <p className="setting-toggle-sub">Use FaceID / Windows Hello to authorize sessions</p>
                            </div>
                            <input
                                type="checkbox"
                                className="custom-switch"
                                checked={biometricLogin}
                                onChange={(e) => setBiometricLogin(e.target.checked)}
                            />
                        </div>

                        <div className="setting-toggle-item">
                            <div>
                                <h4>Real-Time Transaction Alerts</h4>
                                <p className="setting-toggle-sub">Instant email dispatch for debits and credits</p>
                            </div>
                            <input
                                type="checkbox"
                                className="custom-switch"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                            />
                        </div>
                    </div>

                    <button className="btn-primary btn-sm mt-4" onClick={handleSaveSecurity}>
                        Update Security Credentials
                    </button>
                </div>

                {/* Preferences & Theme */}
                <div className="settings-card glass-card">
                    <div className="section-header">
                        <div className="flex-align-gap">
                            <Sun size={18} className="text-emerald" />
                            <h3>App Preferences & Appearance</h3>
                        </div>
                    </div>

                    <div className="settings-toggles-list">
                        <div className="setting-toggle-item">
                            <div>
                                <h4>Theme Mode</h4>
                                <p className="setting-toggle-sub">Currently: {theme === 'dark' ? 'Dark Luxury' : 'Light Clean'}</p>
                            </div>
                            <button className="btn-secondary btn-sm" onClick={toggleTheme}>
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                        </div>

                        <div className="setting-toggle-item">
                            <div>
                                <h4>Balance Masking (Privacy Mode)</h4>
                                <p className="setting-toggle-sub">Obfuscate balance figures on screen</p>
                            </div>
                            <button className="btn-secondary btn-sm" onClick={togglePrivacy}>
                                {isPrivacyEnabled ? <EyeOff size={15} /> : <Eye size={15} />}
                                <span>{isPrivacyEnabled ? 'Masked' : 'Visible'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Diagnostics */}
                <div className="settings-card glass-card">
                    <div className="section-header">
                        <div className="flex-align-gap">
                            <Activity size={18} className="text-emerald" />
                            <h3>Core Engine Diagnostics</h3>
                        </div>
                    </div>

                    <div className="diagnostics-box">
                        <div className="diag-row">
                            <span>Backend Engine:</span>
                            <span className="badge badge-success">Node.js + Express 5</span>
                        </div>
                        <div className="diag-row">
                            <span>Database:</span>
                            <span className="badge badge-neutral">MongoDB Replica Set ACID</span>
                        </div>
                        <div className="diag-row">
                            <span>Active Environment:</span>
                            <span className={isDemo ? 'badge badge-warning' : 'badge badge-success'}>
                                {isDemo ? 'Interactive Sandbox Mode' : 'Live Core Cluster'}
                            </span>
                        </div>
                        {pingLatency !== null && (
                            <div className="diag-row">
                                <span>Diagnostic Latency:</span>
                                <span className="amount-mono text-emerald">{pingLatency} ms</span>
                            </div>
                        )}
                    </div>

                    <div className="diag-actions mt-4">
                        <button
                            className="btn-secondary btn-sm"
                            onClick={handlePingBackend}
                            disabled={isPinging}
                        >
                            <Activity size={14} className={isPinging ? 'animate-spin' : ''} />
                            <span>{isPinging ? 'Pinging Server...' : 'Run Connectivity Diagnostic'}</span>
                        </button>

                        <button
                            className="btn-secondary btn-sm"
                            onClick={() => toggleDemoMode(!isDemo)}
                        >
                            <span>Toggle {isDemo ? 'Live Server' : 'Sandbox Mode'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
