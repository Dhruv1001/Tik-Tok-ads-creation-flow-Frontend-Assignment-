import { useMemo, useState } from "react";
import { validateAdForm } from "../utils/validators";
import { mockCreateAd, mockValidateMusicId } from "../services/mockTikTokApi";
import MusicSelector from "./MusicSelector";
import "../styles/app.css"

export default function AdForm({ token, setGlobalError, setSuccessMessage }) {
  const [form, setForm] = useState({
    campaignName: "",
    objective: "Traffic",
    adText: "",
    cta: "Learn More",
    musicOption: "existing",
    musicId: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = useMemo(() => form.adText.length, [form.adText]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear field error on change
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const validateMusicIfRequired = async () => {
    if (form.musicOption !== "existing") return true;
    const res = await mockValidateMusicId({ token, musicId: form.musicId });

    if (!res.ok) {
      setErrors((prev) => ({ ...prev, musicId: res.message }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccessMessage("");

    if (!token) {
      setGlobalError("Please connect your TikTok Ads account first.");
      return;
    }

    const newErrors = validateAdForm(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const isMusicOk = await validateMusicIfRequired();
    if (!isMusicOk) return;

    setIsSubmitting(true);

    const res = await mockCreateAd({
      token,
      payload: form
    });

    setIsSubmitting(false);

    if (!res.ok) {
      if (res.status === 401) {
        setGlobalError("Your session expired. Please reconnect TikTok Ads account.");
      } else if (res.status === 403) {
        setGlobalError(res.message);
      } else {
        setGlobalError(res.message || "Something went wrong while creating the ad.");
      }
      return;
    }

    setSuccessMessage(
      `Ad created successfully ✅ Campaign: ${res.data.campaign_id}, AdGroup: ${res.data.adgroup_id}, Ad: ${res.data.ad_id}`
    );

    // reset
    setForm({
      campaignName: "",
      objective: "Traffic",
      adText: "",
      cta: "Learn More",
      musicOption: "existing",
      musicId: ""
    });
    setErrors({});
  };

  return (
    <div className="card">
      <h2>2) Ad Creation Form</h2>
      <p className="small">
        All API calls are mocked. This app simulates real TikTok API responses + errors.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label>Campaign Name</label>
            <input
              value={form.campaignName}
              onChange={(e) => onChange("campaignName", e.target.value)}
              placeholder="e.g. Summer Sale Campaign"
            />
            {errors.campaignName && <div className="error">{errors.campaignName}</div>}
          </div>

          <div className="col">
            <label>Objective</label>
            <select
              value={form.objective}
              onChange={(e) => {
                const obj = e.target.value;
                onChange("objective", obj);

                // enforce rule: conversions cannot be no music
                if (obj === "Conversions" && form.musicOption === "none") {
                  onChange("musicOption", "existing");
                  onChange("musicId", "");
                }
              }}
            >
              <option value="Traffic">Traffic</option>
              <option value="Conversions">Conversions</option>
            </select>
            {errors.objective && <div className="error">{errors.objective}</div>}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Ad Text</label>
          <textarea
            value={form.adText}
            onChange={(e) => onChange("adText", e.target.value)}
            placeholder="Write ad text (max 100 chars)"
          />
          <div className="small">{charCount}/100</div>
          {errors.adText && <div className="error">{errors.adText}</div>}
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div className="col">
            <label>CTA</label>
            <select value={form.cta} onChange={(e) => onChange("cta", e.target.value)}>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
            </select>
            {errors.cta && <div className="error">{errors.cta}</div>}
          </div>
        </div>

        <div className="hr" />

        <MusicSelector
          token={token}
          objective={form.objective}
          musicOption={form.musicOption}
          setMusicOption={(v) => onChange("musicOption", v)}
          musicId={form.musicId}
          setMusicId={(v) => onChange("musicId", v)}
          errors={errors}
          setErrors={setErrors}
          setGlobalError={setGlobalError}
        />

        <div className="hr" />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Submit Ad"}
          </button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          Dev Tips:
          <ul>
            <li>Set token with word <b>expired</b> to simulate 401</li>
            <li>Set token with word <b>geo</b> to simulate 403 geo restriction</li>
            <li>Set token with word <b>noperm</b> to simulate 403 permission error</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
