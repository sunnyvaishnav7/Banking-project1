import { create } from 'zustand';
import { MockUser } from '../../mocks/db/mockData';
import { apiClient } from './apiClient';

interface ToastItem {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
}

interface AppState {
    user: MockUser | null;
    isAuthenticated: boolean;
    isPrivacyMasked: boolean;
    isLockedOut: boolean;
    lockoutMessage: string | null;
    isSessionExpiring: boolean;
    activeTab: string;
    toasts: ToastItem[];

    // Actions
    setUser: (user: MockUser | null) => void;
    togglePrivacy: () => void;
    setPrivacyMasked: (val: boolean) => void;
    setActiveTab: (tab: string) => void;
    setSessionExpiring: (val: boolean) => void;
    addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
    removeToast: (id: string) => void;
    logout: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isPrivacyMasked: false,
    isLockedOut: false,
    lockoutMessage: null,
    isSessionExpiring: false,
    activeTab: 'home',
    toasts: [],

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    togglePrivacy: () => set((state) => ({ isPrivacyMasked: !state.isPrivacyMasked })),
    setPrivacyMasked: (val) => set({ isPrivacyMasked: val }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSessionExpiring: (val) => set({ isSessionExpiring: val }),

    addToast: (message, type = 'info', title) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, type, title, message };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => get().removeToast(id), 4500);
    },

    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    logout: async () => {
        await apiClient.auth.logout();
        set({
            user: null,
            isAuthenticated: false,
            activeTab: 'login',
            isSessionExpiring: false,
        });
    },
}));
