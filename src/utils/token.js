export function isTokenExpired(token) {
  if (!token) return false;

  return token.includes("expired");
}
