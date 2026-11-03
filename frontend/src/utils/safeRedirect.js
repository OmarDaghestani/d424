// Returns `next` only when it's a same-site path ("/checkout?..."), so a crafted
// ?next= link can't bounce a freshly signed-in user to another site.
// Rejects "//host" and "/\host", which browsers treat as protocol-relative URLs.
export const safeRedirect = (next, fallback = "/") => {
  if (typeof next !== "string" || !next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
};
