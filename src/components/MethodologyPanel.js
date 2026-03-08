'use client';

const eqStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--accent-emerald)',
  background: 'rgba(45, 212, 160, 0.06)',
  border: '1px solid rgba(45, 212, 160, 0.12)',
  borderRadius: 6,
  padding: '10px 14px',
  marginTop: 8,
  marginBottom: 4,
  lineHeight: 1.6,
  overflowX: 'auto',
};

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginTop: 16,
  marginBottom: 4,
};

const descStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

export default function MethodologyPanel({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      top: 70,
      left: 16,
      zIndex: 30,
      width: 420,
      maxHeight: 'calc(100vh - 86px)',
      overflowY: 'auto',
      animation: 'fadeInUp 0.3s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: 'var(--panel-padding)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Methodology & Equations
          </h2>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>✕</button>
        </div>

        {/* Composite Risk */}
        <div style={labelStyle}>1. Composite Risk Score (0–100)</div>
        <p style={descStyle}>
          Blends normalized carbon intensity and water stress with equal weighting. Scores above 70 indicate high sustainability risk for data center siting.
        </p>
        <div style={eqStyle}>
          C_norm = min(CO₂_rate / 1600, 1)<br/>
          W_norm = min(stress_score / 5.0, 1)<br/>
          <br/>
          <strong>Composite = (C_norm × 0.5 + W_norm × 0.5) × 100</strong>
        </div>
        <p style={{ ...descStyle, fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          Where 1600 lb/MWh is the normalization ceiling for CO₂ rate and 5.0 is the maximum Aqueduct water stress score.
        </p>

        {/* Carbon Intensity */}
        <div style={labelStyle}>2. Carbon Intensity</div>
        <p style={descStyle}>
          Direct output emission rate from EPA eGRID 2022 subregion data. Represents the average CO₂ emitted per MWh of electricity generated in the grid region.
        </p>
        <div style={eqStyle}>
          <strong>CO₂_rate = eGRID subregion annual output emission rate</strong><br/>
          Unit: lb CO₂ / MWh
        </div>
        <p style={{ ...descStyle, fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          Source: EPA eGRID2022 Summary Tables, subregion-level (SRL) annual output emission rates.
        </p>

        {/* Water Stress */}
        <div style={labelStyle}>3. Water Stress Factor</div>
        <p style={descStyle}>
          Baseline water stress from WRI Aqueduct 4.0. Measures the ratio of total water withdrawals to available renewable surface and groundwater supply.
        </p>
        <div style={eqStyle}>
          <strong>BWS = Total Withdrawals / Available Supply</strong><br/>
          Score mapped: 0–1 (Low) → 4–5 (Extremely High)
        </div>
        <p style={{ ...descStyle, fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          Values above 0.8 indicate that over 80% of available water is already allocated. SASB TC-SI-130a.2 flags this as material for data centers using evaporative cooling.
        </p>

        {/* Carbon Cost */}
        <div style={labelStyle}>4. Carbon Cost per MWh</div>
        <p style={descStyle}>
          Implied carbon surcharge on electricity, combining the grid emissions rate with a user-specified carbon price and facility PUE overhead.
        </p>
        <div style={eqStyle}>
          <strong>Carbon_Cost = (CO₂_rate / 2000) × Price × PUE</strong><br/>
          <br/>
          Where:<br/>
          &nbsp;&nbsp;CO₂_rate = lb CO₂/MWh (from eGRID)<br/>
          &nbsp;&nbsp;2000 = lb per short ton conversion<br/>
          &nbsp;&nbsp;Price = $/ton CO₂ (user input, $0–250)<br/>
          &nbsp;&nbsp;PUE = Power Usage Effectiveness (user input, 1.0–2.5)
        </div>

        {/* Annual Cost */}
        <div style={labelStyle}>5. Estimated Annual Carbon Cost</div>
        <p style={descStyle}>
          Annualized carbon cost liability for the full data center campus, assuming 85% capacity factor.
        </p>
        <div style={eqStyle}>
          <strong>Annual_Cost = Carbon_Cost × Capacity_MW × 8,760 × 0.85</strong><br/>
          <br/>
          Where:<br/>
          &nbsp;&nbsp;8,760 = hours per year<br/>
          &nbsp;&nbsp;0.85 = assumed capacity factor<br/>
          &nbsp;&nbsp;Capacity_MW = site power capacity (MW)
        </div>

        {/* Data Sources */}
        <div style={labelStyle}>Data Sources</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'EPA eGRID 2022', url: 'https://www.epa.gov/egrid', desc: 'Grid subregion CO₂ emission rates' },
            { name: 'WRI Aqueduct 4.0', url: 'https://www.wri.org/aqueduct', desc: 'Baseline water stress by watershed' },
            { name: 'EIA-860', url: 'https://www.eia.gov/electricity/data/eia860/', desc: 'Generator location and capacity data' },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', padding: '8px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
              textDecoration: 'none', transition: 'border-color 0.2s',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
            </a>
          ))}
        </div>

        {/* SASB alignment */}
        <div style={labelStyle}>SASB Alignment</div>
        <p style={descStyle}>
          This tool maps to SASB Technology & Communications sector standards for Software & IT Services:
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-emerald)', padding: '4px 10px', borderRadius: 4, background: 'rgba(45,212,160,0.08)', border: '1px solid rgba(45,212,160,0.2)' }}>
            TC-SI-130a.1 — Energy Management
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: 4, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            TC-SI-130a.2 — Water Management
          </span>
        </div>
      </div>
    </div>
  );
}
