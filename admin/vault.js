"use strict";

const DashboardVault = (() => {
  const storageKey = "mahmoud-portfolio.admin.vault.v1";
  const rounds = 600000;
  const encoder = new TextEncoder();

  const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

  async function deriveKey(password, salt) {
    if (!globalThis.crypto?.subtle) throw new Error(tr("افتح اللوحة عبر HTTPS عشان تقدر تحفظ رمز GitHub مشفّرًا."));
    const secret = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: rounds, hash: "SHA-256" },
      secret,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  function read() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  async function save(token, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(token));
    localStorage.setItem(storageKey, JSON.stringify({
      version: 1, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(encrypted)
    }));
  }

  async function unlock(password, stored) {
    try {
      const payload = JSON.parse(stored);
      if (payload?.version !== 1) throw new Error("Unsupported vault version");
      const salt = fromBase64(payload.salt);
      const iv = fromBase64(payload.iv);
      const encrypted = fromBase64(payload.data);
      if (salt.length !== 16 || iv.length !== 12 || encrypted.length < 16 || encrypted.length > 2048) {
        throw new Error("Invalid vault");
      }
      const key = await deriveKey(password, salt);
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
      return new TextDecoder("utf-8", { fatal: true }).decode(plain);
    } catch {
      throw new Error(tr("تعذر فتح الربط المحفوظ. راجع كلمة المرور، أو امسح الربط وأعد الإعداد."));
    }
  }

  return { read, save, unlock, clear: () => localStorage.removeItem(storageKey) };
})();
