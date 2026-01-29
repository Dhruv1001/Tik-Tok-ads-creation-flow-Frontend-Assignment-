# TikTok Ads Creation Flow (Frontend Assignment)

## Overview
This is a single-page React app simulating a TikTok Ads ad creation flow:
- OAuth connect (mocked)
- Campaign form with validation
- Music selection rules (Traffic vs Conversions)
- Mock API submission with full error handling

## Why Mocked?
TikTok is restricted/banned in India, so real OAuth & TikTok Ads API calls may fail.
To ensure reliable testing, all endpoints are mocked while preserving realistic behavior.

## Features
- Connect TikTok Ads Account (mock OAuth token)
- Create ad form:
  - Campaign name validation
  - Objective: Traffic / Conversions
  - Ad text (max 100 chars)
  - CTA selection
- Music options:
  - existing music ID (validated)
  - upload custom music (mock generates ID)
  - no music (only allowed for Traffic)
- Error handling:
  - 401 token expired
  - 403 geo restriction / missing permission
  - 400 invalid music ID

## Run locally
```bash
npm install
npm run dev
