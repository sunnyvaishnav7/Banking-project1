import React, { useState } from 'react';
import { Shield, Fingerprint, Eye, EyeOff, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import './MobileScreens.css';

interface OnboardingLoginScreenProps {
    onLoginSuccess: (name: string, email: string) => void;
}

const OnboardingLoginScreen: React.FC<OnboardingLoginScreenProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('alex.wright@apexbank.io');
    const [password, setPassword] = useState('••••••••••••');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onLoginSuccess('Alexander Wright', email);
        }, 300);
    };

    const handleBiometricAuth = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onLoginSuccess('Alexander Wright', 'alex.wright@apexbank.io');
        }, 200);
    };

    return (
        <div className="mobile-screen-content login-screen animate-fade-in">
            {/* Top Brand Logo */}
            <div className="login-brand-header">
                <div className="login-logo-box">
                    <Shield size={32} color="#1E5EFF" strokeWidth={2.2} />
                </div>
                <h1 className="screen-title mt-3">Apex Mobile</h1>
                <p className="caption-label mt-1">Clean, conversation-first digital banking</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group-mobile">
                    <label className="caption-label">Email or Phone</label>
                    <div className="input-field-wrap">
                        <input
                            type="text"
                            className="input-box"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="input-group-mobile">
                    <div className="flex-between">
                        <label className="caption-label">Password</label>
                        <button type="button" className="btn-text p-0 text-xs">
                            Forgot password?
                        </button>
                    </div>
                    <div className="input-field-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="input-box pr-10"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="input-right-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-primary mt-4" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight size={18} />
                </button>

                {/* Biometric Option */}
                <button
                    type="button"
                    className="btn-secondary mt-3"
                    onClick={handleBiometricAuth}
                    disabled={isSubmitting}
                >
                    <Fingerprint size={20} color="#1E5EFF" />
                    <span>Sign in with Face ID / Touch ID</span>
                </button>
            </form>

            {/* Bottom Security Note */}
            <div className="login-footer">
                <Lock size={14} color="#6B7280" />
                <span className="caption-label">256-Bit Encrypted &bull; FDIC Insured</span>
            </div>
        </div>
    );
};

export default OnboardingLoginScreen;
