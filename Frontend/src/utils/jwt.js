export function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function extractRoleFromToken(accessToken) {
  const payload = parseJwt(accessToken);
  if (!payload) return "Customer";

  return (
    payload.role ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload.roles ||
    "Customer"
  );
}