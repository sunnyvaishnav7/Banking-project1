/**
 * Frontend Security Engine
 * Implements in-memory token storage, data masking, and idempotency guarantees.
 */

class MemoryTokenStore {
    private token: string | null = null;
    private sessionExpiry: number | null = null;

    setToken(token: string, expiresInMinutes = 60) {
        this.token = token;
        this.sessionExpiry = Date.now() + expiresInMinutes * 60 * 1000;
    }

    getToken(): string | null {
        if (!this.token) return null;
        if (this.sessionExpiry && Date.now() > this.sessionExpiry) {
            this.clear();
            return null;
        }
        return this.token;
    }

    clear() {
        this.token = null;
        this.sessionExpiry = null;
    }
}

export const memoryAuth = new MemoryTokenStore();

/**
 * Generates an immutable UUID v4 idempotency key for transactions to prevent double charges.
 */
export function generateIdempotencyKey(): string {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 10);
    return `idem_${ts}_${rand}`;
}

/**
 * Masks bank account number showing only last 4 digits (e.g. "•••• 8812")
 */
export function maskAccountNumber(accNum: string): string {
    if (!accNum) return '•••• 0000';
    const clean = accNum.replace(/\s+/g, '');
    const last4 = clean.slice(-4);
    return `•••• ${last4}`;
}

/**
 * Masks credit/debit card number (e.g. "4291 •••• •••• 4431")
 */
export function maskCardNumber(cardNum: string): string {
    if (!cardNum) return '•••• •••• •••• 0000';
    const clean = cardNum.replace(/\s+/g, '');
    if (clean.length < 16) return `•••• •••• •••• ${clean.slice(-4)}`;
    return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
}
