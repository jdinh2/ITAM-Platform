export const ITAM_STORAGE_KEYS = {
  assets: "itam_assets",
  assetActivity: "itam_asset_activity",
  cases: "itam_cases",
  auditEvents: "itam_audit_events",
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function loadStoredDataset(key, fallbackValue) {
  if (!canUseStorage()) return fallbackValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;

    const parsed = JSON.parse(raw);
    return parsed == null ? fallbackValue : parsed;
  } catch (error) {
    console.warn(`[persistence] Failed to parse ${key}. Falling back to seed data.`, error);
    return fallbackValue;
  }
}

export function saveStoredDataset(key, value) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[persistence] Failed to save ${key}.`, error);
  }
}

export function clearStoredDatasets(keys) {
  if (!canUseStorage()) return;

  keys.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[persistence] Failed to clear ${key}.`, error);
    }
  });
}
