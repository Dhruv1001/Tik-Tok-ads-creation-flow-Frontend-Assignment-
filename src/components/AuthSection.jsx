import { authStorage } from "../services/authStorage";
import { mockOAuthConnect } from "../services/mockTikTokApi";
import { isTokenExpired } from "../utils/token";

export default function AuthSection({ token, setToken, setGlobalError }) {
  const expired = isTokenExpired(token);

  const handleConnect = async () => {
    setGlobalError("");
    try {
      const res = await mockOAuthConnect();
      authStorage.setToken(res.access_token);
      setToken(res.access_token);
    } catch (err) {
      setGlobalError("Failed to connect TikTok account. Try again.");
    }
  };

  const handleLogout = () => {
    authStorage.clearToken();
    setToken("");
    setGlobalError("");
  };

  const statusText = !token
    ? "Not Connected"
    : expired
    ? "Session Expired ⚠️"
    : "Connected ✅";

  return (
    <div className="card">
      <h2>1) TikTok Ads Account Connection</h2>
      <p className="small">
        OAuth is mocked due to TikTok restrictions in India. This simulates access_token generation.
      </p>

      <div className="row" style={{ alignItems: "center" }}>
        <div className="col">
          <span className={`pill ${!token ? "neutral" : expired ? "warning" : "success"}`}>
                {statusText}
          </span>


          {token && (
            <div className="small" style={{ marginTop: 6 }}>
              Token: <b>{token.slice(0, 18)}...</b>
            </div>
          )}

          {expired && (
            <div className="error" style={{ marginTop: 6 }}>
              Your token has expired. Please reconnect.
            </div>
          )}
        </div>

        <div className="col" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {!token || expired ? (
            <button onClick={handleConnect}>
              {expired ? "Reconnect TikTok Ads Account" : "Connect TikTok Ads Account"}
            </button>
          ) : (
            <button className="danger" onClick={handleLogout}>
              Disconnect
            </button>
          )}

          {token && (
            <button className="secondary" onClick={handleLogout}>
              Clear Token
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
