import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
    Shield,
    Lock,
    Mail,
    User as UserIcon,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Eye,
    EyeOff,
    Zap,
    Globe2,
    KeyRound
} from 'lucide-react';
import './AuthPage.css';

const AuthPage: React.FC = () => {
    const { login, register, demoLogin, isBackendOnline } = useAuth();
    const { showToast } = useToast();

    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            showToast('Please enter both email and password', 'warning');
            return;
        }

        setIsLoading(true);
        if (isLoginView) {
            await login(email, password);
        } else {
            if (!name.trim()) {
                showToast('Please enter your full legal name', 'warning');
                setIsLoading(false);
                return;
            }
            await register(name, email, password);
        }
        setIsLoading(false);
    };

    const handleFillDemoCreds = () => {
        setEmail('alex.wright@apexbank.io');
        setPassword('ApexMaster#2026');
        showToast('Demo credentials autofilled. Click "Sign In" or "Instant Sandbox"', 'info');
    };

    return (
        <div className="auth-page-container">
            {/* Left Showcase Banner */}
            <div className="auth-showcase-panel">
                <div className="showcase-glow"></div>
                <div className="showcase-brand">
                    <div className="brand-logo-icon">
                        <Shield size={24} />
                        <Sparkles size={14} className="sparkle-accent" />
                    </div>
                    <span className="showcase-brand-name">ApexBank</span>
                </div>

                <div className="showcase-content">
                    <span className="badge badge-success mb-3">Institutional-Grade Banking 2.0</span>
                    <h1 className="showcase-headline">
                        Next-Gen Multi-Currency <br />
                        <span className="text-gradient">Double-Entry Financial Suite</span>
                    </h1>
                    <p className="showcase-desc">
                        Manage global treasury accounts, execute atomic ACID wire transfers, issue smart virtual cards, and track wealth with institutional precision.
                    </p>

                    <div className="showcase-features-list">
                        <div className="showcase-feature-item">
                            <div className="feature-icon-wrap"><Zap size={18} /></div>
                            <div>
                                <h4>Sub-Second Settlement</h4>
                                <p>Idempotency-locked 10-step ACID transactions engine.</p>
                            </div>
                        </div>

                        <div className="showcase-feature-item">
                            <div className="feature-icon-wrap"><Globe2 size={18} /></div>
                            <div>
                                <h4>Global Multi-Currency Hub</h4>
                                <p>Instant accounts in INR, USD, EUR, GBP & AED with live rates.</p>
                            </div>
                        </div>

                        <div className="showcase-feature-item">
                            <div className="feature-icon-wrap"><KeyRound size={18} /></div>
                            <div>
                                <h4>Zero-Knowledge Security</h4>
                                <p>Encrypted tokens, session blacklisting and biometric protection.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="showcase-footer">
                    <div className="trust-stats">
                        <div className="trust-stat-item">
                            <span className="stat-num amount-mono">99.999%</span>
                            <span className="stat-label">Core Uptime</span>
                        </div>
                        <div className="trust-stat-item">
                            <span className="stat-num amount-mono">256-bit</span>
                            <span className="stat-label">AES Encryption</span>
                        </div>
                        <div className="trust-stat-item">
                            <span className="stat-num amount-mono">&lt; 50ms</span>
                            <span className="stat-label">Ledger Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Auth Form */}
            <div className="auth-form-panel">
                <div className="auth-card glass-card">
                    {/* View Switcher Tabs */}
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`auth-tab ${isLoginView ? 'active' : ''}`}
                            onClick={() => setIsLoginView(true)}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${!isLoginView ? 'active' : ''}`}
                            onClick={() => setIsLoginView(false)}
                        >
                            Open Account
                        </button>
                    </div>

                    <div className="auth-header">
                        <h2>{isLoginView ? 'Welcome to Apex Portal' : 'Create Banking Profile'}</h2>
                        <p className="auth-subtitle">
                            {isLoginView
                                ? 'Access your high-yield accounts, cards & wire transfers'
                                : 'Join over 450,000+ businesses and global wealth leaders'}
                        </p>
                    </div>

                    {/* Instant Demo Sandbox Shortcut */}
                    <div className="demo-shortcut-banner">
                        <div className="demo-shortcut-left">
                            <Sparkles size={16} className="text-emerald" />
                            <span>Quick Access: Explore instant sandbox without registration</span>
                        </div>
                        <button type="button" className="btn-primary btn-sm" onClick={demoLogin}>
                            Instant Sandbox
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLoginView && (
                            <div className="input-group">
                                <label className="input-label">Full Legal Name</label>
                                <div className="input-wrapper">
                                    <UserIcon size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className="input-field has-icon"
                                        placeholder="Alexander Wright"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={!isLoginView}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    className="input-field has-icon"
                                    placeholder="alex.wright@apexbank.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="flex-between">
                                <label className="input-label">Password</label>
                                {isLoginView && (
                                    <button
                                        type="button"
                                        className="btn-ghost btn-sm font-xs p-0 text-emerald"
                                        onClick={handleFillDemoCreds}
                                    >
                                        Fill Demo Creds
                                    </button>
                                )}
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field has-icon"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary btn-lg w-full mt-4 auth-submit-btn"
                            disabled={isLoading}
                        >
                            <span>{isLoading ? 'Verifying...' : isLoginView ? 'Sign In to Portal' : 'Open My Free Account'}</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        <span>Protected by 256-bit TLS Encryption &bull; Apex Core v4.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
