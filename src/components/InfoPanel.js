'use client';

export default function InfoPanel({ dc, carbonPrice, pue, onClose }) {
  // Compute carbon cost: (lb CO2/MWh) * (1 ton / 2000 lb) * $/ton * PUE
  const annualMWhPer_MW = 8760 * 0.85; // capacity factor ~85% for DC
  const carbonCostPerMWh = (dc.co2_rate / 2000) * carbonPrice * pue;
  const annualCarbonCost = carbonCostPerMWh * annualMWhPer_MW * dc.capacity_mw;

  // Water stress color
  const stressColor = dc.stress_score >= 4 ? '#dc2626'
    : dc.stress_score >= 3 ? '#fb923c'
    : dc.stress_score >= 2 ? '#fbbf24'
    : '#38bdf8';

  // Carbon color
  const carbonColor = dc.co2_rate >= 1200 ? '#ef4444'
    : dc.co2_rate >= 900 ? '#f97316'
    : dc.co2_rate >= 600 ? '#fbbf24'
    : '#2dd4a0';

  // Composite score (0-100)
  const carbonNorm = Math.min(dc.co2_rate / 1600, 1);
  const waterNorm = Math.min(dc.stress_score / 5, 1);
  const compositeScore = Math.round((carbonNorm * 0.5 + waterNorm * 0.5) * 100);
  const compositeColor = compositeScore >= 70 ? '#ef4444'
    : compositeScore >= 45 ? '#f97316'
    : compositeScore >= 25 ? '#fbbf24'
    : '#2dd4a0';

  const formatCost = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 20,
      width: 340,
      maxHeight: 'calc(100vh - 32px)',
      overflowY: 'auto',
      animation: 'slideInLeft 0.3s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: 'var(--panel-padding)' }}>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: 6,
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 16, paddingRight: 32 }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>
            {dc.name}
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
            marginTop: 4,
          }}>
            {dc.operator}
          </p>
        </div>

        {/* Composite Score Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 10,
          background: `${compositeColor}08`,
          border: `1px solid ${compositeColor}30`,
          marginBottom: 16,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `conic-gradient(${compositeColor} ${compositeScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 700,
              color: compositeColor,
            }}>
              {compositeScore}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Composite Risk Score
            </div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: compositeColor,
              fontWeight: 600,
              marginTop: 2,
            }}>
              {compositeScore >= 70 ? 'High Risk' : compositeScore >= 45 ? 'Elevated Risk' : compositeScore >= 25 ? 'Moderate Risk' : 'Low Risk'}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>

          {/* Carbon Intensity */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Grid CO₂ Rate</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: carbonColor,
              }}>
                {dc.co2_rate.toFixed(0)}
                <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}> lb/MWh</span>
              </span>
            </div>
            <div style={{
              marginTop: 6,
              height: 3,
              borderRadius: 2,
              background: 'var(--border-subtle)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((dc.co2_rate / 1600) * 100, 100)}%`,
                background: carbonColor,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 6,
            }}>
              eGRID Region: <span style={{ color: 'var(--text-secondary)' }}>{dc.egrid_region}</span>
            </div>
          </div>

          {/* Water Stress */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Water Stress</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: stressColor,
              }}>
                {dc.stress_score.toFixed(1)}
                <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}> /5.0</span>
              </span>
            </div>
            <div style={{
              marginTop: 6,
              height: 3,
              borderRadius: 2,
              background: 'var(--border-subtle)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(dc.stress_score / 5) * 100}%`,
                background: stressColor,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 6,
            }}>
              Classification: <span style={{ color: stressColor }}>{dc.stress_label}</span>
            </div>
          </div>

          {/* Carbon Cost */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: 'rgba(45, 212, 160, 0.04)',
            border: '1px solid rgba(45, 212, 160, 0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Carbon Cost / MWh</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--accent-emerald)',
              }}>
                ${carbonCostPerMWh.toFixed(2)}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 6,
            }}>
              Est. Annual Carbon Cost ({dc.capacity_mw} MW): <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{formatCost(annualCarbonCost)}</span>
            </div>
          </div>
        </div>

        {/* Capacity & Notes */}
        <div style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}>Notes</div>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {dc.notes}
          </p>
        </div>

        {/* SASB Tag */}
        <div style={{
          marginTop: 12,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            padding: '3px 8px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            SASB TC-SI-130a.1
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            padding: '3px 8px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            SASB TC-SI-130a.2
          </span>
        </div>
      </div>
    </div>
  );
}
