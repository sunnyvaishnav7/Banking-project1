import { useEffect, useRef } from 'react';
import { useAppStore } from '../lib/useAppStore';

const INACTIVITY_LIMIT_MS = 3 * 60 * 1000; // 3 Minutes
const WARNING_BEFORE_MS = 30 * 1000; // 30s Warning

export function useInactivityTimer() {
    const { isAuthenticated, logout, setSessionExpiring, setPrivacyMasked } = useAppStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (!isAuthenticated) return;
        setSessionExpiring(false);

        if (timerRef.current) clearTimeout(timerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

        // Warning timer
        warningTimerRef.current = setTimeout(() => {
            setSessionExpiring(true);
        }, INACTIVITY_LIMIT_MS - WARNING_BEFORE_MS);

        // Logout timer
        timerRef.current = setTimeout(() => {
            logout();
        }, INACTIVITY_LIMIT_MS);
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        const handleActivity = () => resetTimer();

        events.forEach((evt) => window.addEventListener(evt, handleActivity));

        // Auto blur/mask on tab loss of focus
        const handleFocus = () => setPrivacyMasked(false);
        const handleBlur = () => setPrivacyMasked(true);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        resetTimer();

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, handleActivity));
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        };
    }, [isAuthenticated]);
}
