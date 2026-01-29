const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const randomId = (prefix) => `${prefix}_${Math.floor(Math.random() * 1e6)}`;

export async function mockOAuthConnect() {
  await delay(800);
  return {
    access_token: `mock_token_${Date.now()}`,
    expires_in: 3600,
    token_type: "Bearer"
  };
}

export async function mockValidateMusicId({ token, musicId }) {
  await delay(700);

  if (!token) {
    return { ok: false, status: 401, message: "Missing access token" };
  }
  if (token.includes("expired")) {
    return { ok: false, status: 401, message: "Token expired" };
  }

  if (!musicId || musicId.trim().length < 5) {
    return { ok: false, status: 400, message: "Invalid Music ID" };
  }

  if (musicId.toLowerCase().includes("invalid")) {
    return { ok: false, status: 400, message: "Music ID does not exist" };
  }

  return { ok: true, status: 200, data: { valid: true } };
}

export async function mockCreateAd({ token, payload }) {
  await delay(1000);

  if (!token) {
    return { ok: false, status: 401, message: "Missing access token" };
  }

  if (token.includes("expired")) {
    return { ok: false, status: 401, message: "Token expired" };
  }

  if (token.includes("geo")) {
    return {
      ok: false,
      status: 403,
      message: "API not accessible in this region (geo restriction)"
    };
  }

  if (token.includes("noperm")) {
    return {
      ok: false,
      status: 403,
      message: "Missing required Ads permissions"
    };
  }

  if (!payload?.campaignName || payload.campaignName.length < 3) {
    return { ok: false, status: 400, message: "Campaign name invalid" };
  }

  if (payload?.musicOption === "existing" && payload?.musicId?.includes("invalid")) {
    return { ok: false, status: 400, message: "Invalid music ID" };
  }

  return {
    ok: true,
    status: 200,
    data: {
      campaign_id: randomId("cmp"),
      adgroup_id: randomId("adg"),
      ad_id: randomId("ad")
    }
  };
}
