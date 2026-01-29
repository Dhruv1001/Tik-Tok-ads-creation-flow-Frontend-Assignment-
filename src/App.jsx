import { useEffect, useState } from "react";
import AuthSection from "./components/AuthSection";
import AdForm from "./components/AdForm";
import ErrorBanner from "./components/ErrorBanner";
import SuccessBanner from "./components/SuccessBanner";
import { authStorage } from "./services/authStorage";

export default function App() {
  const [token, setToken] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const saved = authStorage.getToken();
    if (saved) setToken(saved);
  }, []);

  return (
    <div className="container">
      <h1>TikTok Ads Creation Flow (Frontend Assignment)</h1>
      <p className="small">
        SPA demo implementing campaign form, music selection logic, validation, and error handling.
      </p>

      <ErrorBanner message={globalError} />
      <SuccessBanner message={successMessage} />

      <AuthSection token={token} setToken={setToken} setGlobalError={setGlobalError} />

      <AdForm token={token} setGlobalError={setGlobalError} setSuccessMessage={setSuccessMessage} />
    </div>
  );
}
