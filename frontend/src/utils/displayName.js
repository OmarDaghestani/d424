export const DISPLAY_NAME_KEY = "techhub_display_name";
export const DISPLAY_NAME_EVENT = "techhub-display-name-changed";

export function getStoredDisplayName() {
  try {
    const v = localStorage.getItem(DISPLAY_NAME_KEY);
    return typeof v === "string" ? v.trim() : "";
  } catch {
    return "";
  }
}

/** Persists name and notifies the navbar (same tab). */
export function setStoredDisplayName(name) {
  if (name == null) return;
  const trimmed = String(name).trim();
  if (!trimmed) return;
  try {
    localStorage.setItem(DISPLAY_NAME_KEY, trimmed);
    window.dispatchEvent(
      new CustomEvent(DISPLAY_NAME_EVENT, { detail: { name: trimmed } })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStoredDisplayName() {
  try {
    localStorage.removeItem(DISPLAY_NAME_KEY);
    window.dispatchEvent(
      new CustomEvent(DISPLAY_NAME_EVENT, { detail: { name: "" } })
    );
  } catch {
    /* ignore */
  }
}

/** Prefer full name; otherwise first part of email for the nav label. */
export function resolveProfileLabel(user) {
  if (!user) return "";
  const n = typeof user.name === "string" ? user.name.trim() : "";
  if (n) return n;
  const e = typeof user.email === "string" ? user.email.trim() : "";
  if (e && e.includes("@")) return e.split("@")[0] || "";
  return "";
}
