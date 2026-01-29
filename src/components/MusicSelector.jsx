import { mockValidateMusicId } from "../services/mockTikTokApi";

export default function MusicSelector({
  token,
  objective,
  musicOption,
  setMusicOption,
  musicId,
  setMusicId,
  errors,
  setErrors,
  setGlobalError
}) {
  const noMusicDisabled = objective === "Conversions";

  const generateMusicId = () => {
    const id = `mock_music_${Math.floor(Math.random() * 1e7)}`;
    setMusicId(id);
  };

  const validateMusic = async () => {
    setGlobalError("");

    if (!musicId) return;

    const res = await mockValidateMusicId({ token, musicId });

    if (!res.ok) {
      setErrors((prev) => ({ ...prev, musicId: res.message }));
      return false;
    } else {
      setErrors((prev) => {
        const cp = { ...prev };
        delete cp.musicId;
        return cp;
      });
      return true;
    }
  };

  return (
    <div>
      <label>Music Option</label>

      <div className="radioGroup">
        {/* Existing music */}
        <div className="radioItem">
          <input
            type="radio"
            name="musicOption"
            value="existing"
            checked={musicOption === "existing"}
            onChange={() => {
              setMusicOption("existing");
              setMusicId("");
            }}
          />

          <div>
            <div className="radioItemLabel">Use Existing Music ID</div>

            {musicOption === "existing" && (
              <div className="radioSub">
                <input
                  placeholder="Enter Music ID"
                  value={musicId}
                  onChange={(e) => setMusicId(e.target.value)}
                  onBlur={validateMusic}
                />
                <div className="tip">
                  Tip: enter <b>"invalid123"</b> to simulate invalid music ID
                </div>

                {errors.musicId && <div className="error">{errors.musicId}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Upload music */}
        <div className="radioItem">
          <input
            type="radio"
            name="musicOption"
            value="upload"
            checked={musicOption === "upload"}
            onChange={() => {
              setMusicOption("upload");
              setMusicId("");
            }}
          />

          <div>
            <div className="radioItemLabel">Upload Custom Music (Mock)</div>

            {musicOption === "upload" && (
              <div className="radioSub">
                <div className="radioSubRow">
                  <button type="button" className="secondary" onClick={generateMusicId}>
                    Upload & Generate Music ID
                  </button>

                  {musicId && <span className="pill neutral">{musicId}</span>}
                </div>

                {errors.musicId && <div className="error">{errors.musicId}</div>}
              </div>
            )}
          </div>
        </div>

        {/* No music */}
        <div className={`radioItem ${noMusicDisabled ? "disabled" : ""}`}>
          <input
            type="radio"
            name="musicOption"
            value="none"
            disabled={noMusicDisabled}
            checked={musicOption === "none"}
            onChange={() => {
              setMusicOption("none");
              setMusicId("");
            }}
          />

          <div>
            <div className="radioItemLabel">No Music (Only allowed for Traffic)</div>
          </div>
        </div>
      </div>

      {errors.musicOption && <div className="error">{errors.musicOption}</div>}
    </div>
  );
}
