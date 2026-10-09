import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../shared/lib/useAppStore';
import { apiClient } from '../../shared/lib/apiClient';
import {
    Shield,
    Fingerprint,
    Eye,
    EyeOff,
    ArrowRight,
    Lock,
    Mail,
    Phone,
    KeyRound,
    Delete,
    CheckCircle2,
    AlertCircle,
    RotateCw
} from 'lucide-react';

interface AuthScreensProps {
    onSuccess: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onSuccess }) => {
    const { setUser, addToast } = useAppStore();
    const [authStep, setAuthStep] = useState<'login' | 'otp' | 'pin'>('login');

    // Login Form State
    const [emailOrPhone, setEmailOrPhone] = useState('alex.wright@apexbank.io');
    const [password, setPassword] = useState('ApexSecure#2026');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // OTP State (6 Boxes)
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpTimer, setOtpTimer] = useState(30);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // PIN Keypad State
    const [enteredPin, setEnteredPin] = useState('');
    const [pinError, setPinError] = useState<string | null>(null);

    // OTP Countdown Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (authStep === 'otp' && otpTimer > 0) {
            interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [authStep, otpTimer]);

    // Handle Login Submit -> Advance to OTP
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);

        try {
            await apiClient.auth.login(emailOrPhone, password);
            setAuthStep('otp');
            setOtpTimer(30);
            addToast('6-digit security code sent. Demo OTP: 123456', 'info', 'OTP Dispatched');
        } catch (err: any) {
            setLoginError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP Box Keystrokes & Auto-Advance
    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }

        // Auto-verify if all 6 filled
        if (newOtp.every((digit) => digit !== '')) {
            verifyOtpCode(newOtp.join(''));
        }
    };

    // Handle OTP Paste (e.g. user pastes "123456")
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const digits = pasted.split('');
            setOtp(digits);
            verifyOtpCode(pasted);
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Verify OTP -> Advance to PIN
    const verifyOtpCode = async (code: string) => {
        setIsLoading(true);
        try {
            const { user } = await apiClient.auth.verifyOtp(code);
            setUser(user);
            setAuthStep('pin');
            addToast('Identity verified. Please enter your 4-digit App PIN.', 'success', 'Step 1 Complete');
        } catch (err: any) {
            addToast(err.message || 'Invalid code', 'error');
            setOtp(['', '', '', '', '', '']);
            otpInputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    // Custom PIN Keypad Entry
    const handleKeypadDigit = async (digit: string) => {
        setPinError(null);
        if (digit === 'del') {
            setEnteredPin((prev) => prev.slice(0, -1));
            return;
        }

        if (enteredPin.length < 4) {
            const nextPin = enteredPin + digit;
            setEnteredPin(nextPin);

            if (nextPin.length === 4) {
                // Verify PIN
                setIsLoading(true);
                try {
                    await apiClient.auth.verifyPin(nextPin);
                    addToast('Welcome back, Alexander!', 'success', 'Authenticated');
                    onSuccess();
                } catch (err: any) {
                    setPinError(err.message);
                    setEnteredPin('');
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    // Biometric Face ID Simulation
    const handleBiometricAuth = async () => {
        setIsLoading(true);
        setTimeout(async () => {
            try {
                await apiClient.auth.verifyPin('1234');
                addToast('Face ID Verified. Cryptographic passkey confirmed.', 'success', 'Biometric Match');
                onSuccess();
            } catch (err: any) {
                setPinError(err.message);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    };

    return (
        <div className="mobile-screen-content login-screen animate-fade-in">
            {/* Logo Brand */}
            <div className="login-brand-header">
                <div className="login-logo-box">
                    <Shield size={32} color="#1E5EFF" strokeWidth={2.2} />
                </div>
                <h1 className="screen-title mt-3">Apex Mobile Banking</h1>
                <p className="caption-label mt-1">Clean, conversation-first financial suite</p>
            </div>

            {/* STEP 1: LOGIN FORM */}
            {authStep === 'login' && (
                <form onSubmit={handleLoginSubmit} className="login-form">
                    {loginError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                            <AlertCircle size={16} />
                            <span>{loginError}</span>
                        </div>
                    )}

                    <div className="input-group-mobile">
                        <label className="caption-label">Email Address or Mobile Number</label>
                        <div className="input-field-wrap">
                            <input
                                type="text"
                                className="input-box"
                                placeholder="alex.wright@apexbank.io"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group-mobile">
                        <div className="flex-between">
                            <label className="caption-label">Account Password</label>
                            <button
                                type="button"
                                className="btn-text p-0 text-xs"
                                onClick={() => {
                                    setEmailOrPhone('alex.wright@apexbank.io');
                                    setPassword('ApexSecure#2026');
                                    addToast('Demo credentials autofilled', 'info');
                                }}
                            >
                                Fill Demo Creds
                            </button>
                        </div>
                        <div className="input-field-wrap">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-box pr-10"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="input-right-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password"
                            >
                                {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary mt-3" disabled={isLoading}>
                        <span>{isLoading ? 'Verifying...' : 'Sign In with Password'}</span>
                        <ArrowRight size={18} />
                    </button>

                    <button
                        type="button"
                        className="btn-secondary mt-2"
                        onClick={handleBiometricAuth}
                        disabled={isLoading}
                    >
                        <Fingerprint size={20} color="#1E5EFF" />
                        <span>Sign In with Face ID / Touch ID</span>
                    </button>
                </form>
            )}

            {/* STEP 2: 6-BOX OTP VERIFICATION */}
            {authStep === 'otp' && (
                <div className="otp-step-container animate-fade-in text-center">
                    <div className="w-12 h-12 rounded-full bg-[#E8F0FF] text-[#1E5EFF] flex items-center justify-center mx-auto mb-2">
                        <KeyRound size={22} />
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#0B0B0B]">Enter 6-Digit Security Code</h2>
                    <p className="caption-label mt-1">
                        We sent an encrypted verification code to {emailOrPhone}. Demo OTP is <strong>123456</strong>.
                    </p>

                    {/* 6 OTP Boxes */}
                    <div className="flex justify-center gap-2 mt-5" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (otpInputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="w-11 h-13 text-center text-[22px] font-semibold text-[#0B0B0B] bg-[#F5F8FF] border border-[#E5E7EB] rounded-xl focus:border-[#1E5EFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E5EFF]/10"
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    {/* Resend Timer */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {otpTimer > 0 ? (
                            <span className="caption-label">Resend code in {otpTimer}s</span>
                        ) : (
                            <button
                                className="btn-text p-0 text-xs font-semibold text-[#1E5EFF] flex items-center gap-1"
                                onClick={() => {
                                    setOtpTimer(30);
                                    addToast('New OTP dispatched: 123456', 'info');
                                }}
                            >
                                <RotateCw size={12} />
                                <span>Resend Code</span>
                            </button>
                        )}
                    </div>

                    <button
                        className="btn-text mt-3 text-xs"
                        onClick={() => setAuthStep('login')}
                    >
                        &larr; Back to Login
                    </button>
                </div>
            )}

            {/* STEP 3: CUSTOM PIN KEYPAD (4 DIGITS) */}
            {authStep === 'pin' && (
                <div className="pin-step-container animate-fade-in text-center">
                    <div className="w-12 h-12 rounded-full bg-[#E8F0FF] text-[#1E5EFF] flex items-center justify-center mx-auto mb-2">
                        <Lock size={22} />
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#0B0B0B]">Enter 4-Digit App PIN</h2>
                    <p className="caption-label mt-1">
                        Use custom keypad to unlock session (Demo PIN: <strong>1234</strong>)
                    </p>

                    {/* PIN Dots Display */}
                    <div className="flex justify-center gap-4 my-5">
                        {[0, 1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                                    idx < enteredPin.length ? 'bg-[#1E5EFF] scale-110' : 'bg-[#E5E7EB]'
                                }`}
                            />
                        ))}
                    </div>

                    {pinError && (
                        <div className="text-xs text-[#DC2626] font-medium mb-3">
                            {pinError}
                        </div>
                    )}

                    {/* Custom Numeric Keypad */}
                    <div className="numeric-keypad-grid mt-2">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((key) => {
                            if (key === 'bio') {
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        className="keypad-btn text-[#1E5EFF]"
                                        onClick={handleBiometricAuth}
                                        aria-label="Use Face ID"
                                    >
                                        <Fingerprint size={22} />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    className="keypad-btn"
                                    onClick={() => handleKeypadDigit(key)}
                                    disabled={isLoading}
                                >
                                    {key === 'del' ? <Delete size={22} color="#0B0B0B" /> : key}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="login-footer">
                <Lock size={14} color="#6B7280" />
                <span className="caption-label">256-Bit Hardware Keystore &bull; FDIC Insured</span>
            </div>
        </div>
    );
};
