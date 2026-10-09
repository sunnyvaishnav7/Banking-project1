/**
 * Financial Currency Engine: Integer-based representation (cents/paise)
 * Guarantees zero floating-point rounding errors during accounting and limit checks.
 */

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
};

/**
 * Converts integer cents to formatted string with tabular numbers
 * @param cents Integer amount in cents (e.g. 2485075 -> $24,850.75)
 * @param currency Currency code ('USD', 'EUR', 'GBP', 'INR')
 * @param showSign Whether to prefix + for positive numbers
 */
export function formatCurrency(
    cents: number,
    currency: SupportedCurrency = 'USD',
    showSign = false
): string {
    const isNegative = cents < 0;
    const absCents = Math.abs(cents);
    const amount = absCents / 100;

    const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formatted = formatter.format(amount);

    if (isNegative) {
        return `-${formatted}`;
    }
    if (showSign && cents > 0) {
        return `+${formatted}`;
    }
    return formatted;
}

/**
 * Convert integer cents to a decimal string (e.g., 15000 -> "150.00")
 */
export function centsToDecimalString(cents: number): string {
    return (cents / 100).toFixed(2);
}

/**
 * Convert user decimal input string to integer cents (e.g., "150.75" -> 15075)
 */
export function decimalStringToCents(val: string): number {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num) || num <= 0) return 0;
    return Math.round(num * 100);
}

/**
 * Safe integer addition
 */
export function addCents(a: number, b: number): number {
    return Math.round(a) + Math.round(b);
}

/**
 * Safe integer subtraction
 */
export function subtractCents(a: number, b: number): number {
    return Math.round(a) - Math.round(b);
}
