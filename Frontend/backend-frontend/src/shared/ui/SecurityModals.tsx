import React, { useState } from 'react';
import { useAppStore } from '../lib/useAppStore';
import {
    AlertTriangle,
    Lock,
    Shield,
    Fingerprint,
    CheckCircle2,
    XCircle,
    Info,
    X,
    Delete
} from 'lucide-react';
import { apiClient } from '../lib/apiClient';

export const SessionExpiringModal: React.FC = () => {
    const { isSessionExpiring, setSessionExpiring, logout } = useAppStore();

    if (!isSessionExpiring) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E5E7EB] text-center">
                <div className="w-12 h-12 rounded-full bg-[#E8F0FF] text-[#1E5EFF] flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B0B0B]">Session Expiring</h3>
                <p className="text-[13px] text-[#6B7280] mt-1">
                    For your security, you will be automatically logged out due to 3 minutes of inactivity.
                </p>

                <div className="flex gap-2 mt-5">
                    <button
                        className="flex-1 h-[46px] rounded-xl border border-[#E5E7EB] text-[14px] font-medium text-[#0B0B0B] hover:bg-[#F5F8FF]"
                        onClick={logout}
                    >
                        Sign Out
                    </button>
                    <button
                        className="flex-1 h-[46px] rounded-xl bg-[#1E5EFF] text-white text-[14px] font-medium hover:bg-[#1446C7]"
                        onClick={() => setSessionExpiring(false)}
                    >
                        Extend Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useAppStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-[calc(100%-48px)] pointer-events-none">
            {toasts.map((toast) => {
                let IconComp = Info;
                let borderClass = 'border-[#1E5EFF]';
                let iconColor = 'text-[#1E5EFF]';

                if (toast.type === 'success') {
                    IconComp = CheckCircle2;
                    borderClass = 'border-[#16A34A]';
                    iconColor = 'text-[#16A34A]';
                } else if (toast.type === 'error') {
                    IconComp = XCircle;
                    borderClass = 'border-[#DC2626]';
                    iconColor = 'text-[#DC2626]';
                }

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto bg-white p-3.5 rounded-xl shadow-lg border-l-4 ${borderClass} border-[#E5E7EB] flex items-start gap-3 animate-fade-in`}
                    >
                        <IconComp size={18} className={`${iconColor} shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                            {toast.title && <div className="text-[13px] font-semibold text-[#0B0B0B]">{toast.title}</div>}
                            <div className="text-[12px] text-[#6B7280]">{toast.message}</div>
                        </div>
                        <button
                            className="text-[#6B7280] hover:text-[#0B0B0B] p-1"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Dismiss notification"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
