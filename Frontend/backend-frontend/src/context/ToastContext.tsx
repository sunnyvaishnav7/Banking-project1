import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = {
            id,
            type,
            title,
            message,
            timestamp: Date.now(),
        };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map((toast) => {
                    let IconComponent = Info;
                    if (toast.type === 'success') IconComponent = CheckCircle2;
                    if (toast.type === 'error') IconComponent = AlertCircle;
                    if (toast.type === 'warning') IconComponent = AlertTriangle;

                    return (
                        <div key={toast.id} className={`toast-item toast-${toast.type} animate-fade-in`}>
                            <div className="toast-icon">
                                <IconComponent size={20} />
                            </div>
                            <div className="toast-body">
                                {toast.title && <div className="toast-title">{toast.title}</div>}
                                <div className="toast-text">{toast.message}</div>
                            </div>
                            <button
                                className="toast-close"
                                onClick={() => removeToast(toast.id)}
                                aria-label="Dismiss notification"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
