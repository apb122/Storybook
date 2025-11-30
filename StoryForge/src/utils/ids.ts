/**
 * Generates a unique ID (UUID v4).
 * Uses crypto.randomUUID() if available (secure contexts),
 * otherwise falls back to a Math.random() based implementation.
 */

// Extend the Crypto interface to include randomUUID if it's missing from the lib definitions
interface CryptoWithUUID {
  randomUUID(): string;
}

export const generateId = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    const crypto = window.crypto as unknown as CryptoWithUUID;
    if (typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID();
      } catch (e) {
        console.warn('crypto.randomUUID() failed, falling back to manual generation', e);
      }
    }
  }

  // Fallback implementation (UUID v4-like)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
