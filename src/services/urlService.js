
import { logger } from "../middleware/logger";


const STORAGE_KEY = "urlMap_v1";

const readStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

const writeStore = (obj) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
};


const isValidCustomCode = (code) => {
  
  return /^[A-Za-z0-9_-]{4,12}$/.test(code);
};

const randomCode = (len = 6) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const ensureUniqueCode = (preferred) => {
  const store = readStore();
  if (preferred) {
    if (store[preferred]) {
      throw new Error("Custom shortcode already exists. Pick another one.");
    }
    return preferred;
  }
  
  let code = randomCode(6);
  while (store[code]) {
    code = randomCode(6);
  }
  return code;
};



export const cleanupExpired = () => {
  const store = readStore();
  const now = Date.now();
  let changed = false;
  for (const [code, rec] of Object.entries(store)) {
    if (rec.expiry && now > rec.expiry) {
      logger("URL_EXPIRED", { shortCode: code, longUrl: rec.longUrl });
      delete store[code];
      changed = true;
    }
  }
  if (changed) writeStore(store);
};


export const createShortUrl = (longUrl, customCode = "", validityMinutes = 30) => {
  if (!longUrl || typeof longUrl !== "string") throw new Error("Invalid URL.");

  
  if (!/^https?:\/\//i.test(longUrl)) {
    throw new Error("Please include http:// or https:// in the URL.");
  }

  const store = readStore();

  const code = customCode ? customCode.trim() : "";
  if (code) {
    if (!isValidCustomCode(code)) {
      throw new Error("Custom code invalid. Use letters, numbers, - or _. Length 4-12.");
    }
    if (store[code]) {
      throw new Error("Custom code already taken.");
    }
  }

  const finalCode = ensureUniqueCode(code || null);
  const expiry = Date.now() + Math.max(1, Number(validityMinutes) || 30) * 60 * 1000;
  store[finalCode] = {
    longUrl,
    expiry,
    createdAt: Date.now(),
  };
  writeStore(store);
  logger("URL_CREATED", { shortCode: finalCode, longUrl, expiry });
  return finalCode;
};

export const getLongUrl = (shortCode) => {
  cleanupExpired(); 
  const store = readStore();
  const rec = store[shortCode];
  if (!rec) return null;

  
  logger("URL_REDIRECT", { shortCode, longUrl: rec.longUrl });
  return rec.longUrl;
};

export const getAllUrls = () => {
  cleanupExpired();
  const store = readStore();
  return Object.entries(store).map(([shortCode, rec]) => ({
    shortCode,
    longUrl: rec.longUrl,
    expiry: rec.expiry,
    createdAt: rec.createdAt,
  }));
};

export const deleteShortUrl = (shortCode) => {
  const store = readStore();
  if (store[shortCode]) {
    const rec = store[shortCode];
    delete store[shortCode];
    writeStore(store);
    logger("URL_DELETED", { shortCode, longUrl: rec.longUrl });
    return true;
  }
  return false;
};
