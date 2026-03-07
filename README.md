# 🌍 Carbon + Water Stress Explorer

**Interactive map showing the true sustainability-adjusted cost of data center siting across the US — combining grid carbon intensity, carbon pricing, and water scarcity risk.**

Built with Mapbox GL JS, Vercel serverless functions, and publicly available EPA eGRID + WRI Aqueduct datasets.

> SASB Alignment: TC-SI-130a.1 (Energy Management) + TC-SI-130a.2 (Water Management in High Stress Regions)

![Demo Preview](https://img.shields.io/badge/status-live-brightgreen)

---

## 📊 Data Sources

| Dataset | Source | What it provides |
|---------|--------|-----------------|
| **EPA eGRID 2022** | [epa.gov/egrid](https://www.epa.gov/egrid) | CO₂ emissions rate (lb/MWh) by grid subregion |
| **EIA-860** | [eia.gov](https://www.eia.gov/electricity/data/eia860/) | Generator & plant location data |
| **WRI Aqueduct 4.0** | [wri.org/aqueduct](https://www.wri.org/aqueduct) | Baseline water stress scores by watershed |

---

## 🚀 Setup — Zero Local Install Required

This project is designed to run **entirely in GitHub Codespaces** and deploy to **Vercel** — no local environment needed.

### Step 1: Create GitHub Repo

1. Go to [github.com/new](https://github.com/new)
2. **Repo name**: `carbon-water-explorer`
3. Set to **Public** (or Private — your choice)
4. Do NOT initialize with README (we'll push our own)
5. Click **Create repository**

### Step 2: Push Code to GitHub

In your Codespace terminal (or any terminal with git):

```bash
git init
git add .
git commit -m "Initial commit: Carbon + Water Stress Explorer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/carbon-water-explorer.git
git push -u origin main
```

### Step 3: Get Your API Keys

#### Mapbox Token
1. Go to [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/)
2. Create a free account if needed
3. Copy your **Default public token** (starts with `pk.`)

> ⚠️ For production, create a scoped token with only the styles and tilesets permissions you need.

### Step 4: Set Up GitHub Codespaces

1. Go to your repo on GitHub
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. The devcontainer config will auto-install Node.js 20 and dependencies
4. Once the Codespace boots, create your env file:

```bash
cp .env.example .env.local
# Edit .env.local and paste your Mapbox token
```

5. Start the dev server:

```bash
npm run dev
```

6. Codespaces will auto-forward port 3000 — click the URL to preview

### Step 5: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select `carbon-water-explorer`
3. In **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.your_mapbox_token_here` |

4. Click **Deploy**

> ✅ That's it. Vercel auto-detects Next.js and handles builds. Every push to `main` triggers a new deploy.

### Step 6: (Optional) Add Codespace Secrets

To avoid re-entering your Mapbox token every time you create a new Codespace:

1. Go to [github.com/settings/codespaces](https://github.com/settings/codespaces)
2. Click **New secret**
3. Name: `NEXT_PUBLIC_MAPBOX_TOKEN`
4. Value: your Mapbox token
5. Repository access: select `carbon-water-explorer`

This secret will automatically be available as an env variable in every Codespace for this repo.

---

## 🏗️ Architecture

```
carbon-water-explorer/
├── .devcontainer/         # Codespace configuration
│   └── devcontainer.json
├── data/                  # Pre-processed static datasets
│   ├── egrid_regions.json # EPA eGRID subregion emissions data
│   ├── water_stress.json  # WRI Aqueduct water stress by region
│   └── datacenters.json   # Major US data center locations
├── public/                # Static assets
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   └── components/
│       ├── Map.js         # Mapbox GL map component
│       ├── Controls.js    # Carbon price slider + toggles
│       ├── Legend.js       # Map legend
│       └── InfoPanel.js   # Region detail panel
├── .env.example           # Template for env vars
├── next.config.js
├── package.json
├── vercel.json
└── README.md
```

---

## 🔑 Key Strategy

| Variable | Where it lives | Why |
|----------|---------------|-----|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `.env.local` (local), Vercel env vars (prod), Codespace secrets (dev) | `NEXT_PUBLIC_` prefix makes it available client-side in Next.js — required for Mapbox GL |

**Security notes:**
- Mapbox tokens are **public by design** — they're embedded in client-side JS. Use Mapbox URL restrictions in your account dashboard to lock the token to your Vercel domain.
- No server-side secrets needed for this demo — all data is static JSON.
- Never commit `.env.local` — it's in `.gitignore`.

---

## License

MIT
