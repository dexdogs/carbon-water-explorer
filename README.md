# 🌍 Carbon + Water Stress Explorer

**Interactive map showing the true sustainability-adjusted cost of data center siting across the US — combining grid carbon intensity, carbon pricing, and water scarcity risk.**

Built with Mapbox GL JS, Vercel serverless functions, and publicly available EPA eGRID + WRI Aqueduct datasets.

> SASB Alignment: TC-SI-130a.1 (Energy Management) + TC-SI-130a.2 (Water Management in High Stress Regions)

---

## 📊 Data Sources

| Dataset | Source | What it provides |
|---------|--------|-----------------|
| **EPA eGRID 2022** | [epa.gov/egrid](https://www.epa.gov/egrid) | CO₂ emissions rate (lb/MWh) by grid subregion |
| **EIA-860** | [eia.gov](https://www.eia.gov/electricity/data/eia860/) | Generator & plant location data |
| **WRI Aqueduct 4.0** | [wri.org/aqueduct](https://www.wri.org/aqueduct) | Baseline water stress scores by watershed |
