/**
 * Debounces a function so it can only be called once every `delay` milliseconds.
 *
 * @param fn - The function to debounce
 * @param delay - Minimum time between calls in milliseconds
 * @returns A debounced version of `fn`
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let last = 0;
    return function(this: any, ...args: any[]) {
        const now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
        }
    } as T;
}

export const capitalize = (text: string) => text.replace(/_/g, ' ').split(' ').map(x => x.length > 0 ? x.charAt(0).toUpperCase() + x.substring(1).toLowerCase() : x).join(' ')
