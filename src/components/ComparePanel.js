'use client';

function MetricRow({ label, valueA, valueB, unit, colorA, colorB, higher_is_worse }) {
  const a = parseFloat(valueA) || 0;
  const b = parseFloat(valueB) || 0;
  const diff = b - a;
  const hasBoth = valueA !== null && valueB !== null;

  // Delta indicator
  let deltaColor = 'var(--text-muted)';
  let deltaLabel = '';
  if (hasBoth && diff !== 0) {
    if (higher_is_worse) {
      deltaColor = diff > 0 ? '#ef4444' : '#2dd4a0';
      deltaLabel = diff > 0 ? `+${Math.abs(diff).toFixed(1)}` : `−${Math.abs(diff).toFixed(1)}`;
    } else {
      deltaColor = diff < 0 ? '#ef4444' : '#2dd4a0';
      deltaLabel = diff > 0 ? `+${Math.abs(diff).toFixed(1)}` : `−${Math.abs(diff).toFixed(1)}`;
    }
  }

  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{label}</span>
        {hasBoth && deltaLabel && (
          <span style={{ color: deltaColor, fontSize: 10, fontWeight: 600 }}>
            {deltaLabel} {unit}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
            color: colorA || 'var(--text-primary)',
          }}>
            {valueA !== null ? valueA : '—'}
          </span>
          {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginLeft: 2 }}>{unit}</span>}
        </div>
        <div style={{ width: 1, background: 'var(--border-active)' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
            color: colorB || 'var(--text-primary)',
          }}>
            {valueB !== null ? valueB : '—'}
          </span>
          {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginLeft: 2 }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function getColors(dc) {
  if (!dc) return { carbon: 'var(--text-muted)', water: 'var(--text-muted)', composite: 'var(--text-muted)' };
  const carbonColor = dc.co2_rate >= 1200 ? '#ef4444' : dc.co2_rate >= 900 ? '#f97316' : dc.co2_rate >= 600 ? '#fbbf24' : '#2dd4a0';
  const stressColor = dc.stress_score >= 4 ? '#dc2626' : dc.stress_score >= 3 ? '#fb923c' : dc.stress_score >= 2 ? '#fbbf24' : '#38bdf8';
  const carbonNorm = Math.min(dc.co2_rate / 1600, 1);
  const waterNorm = Math.min(dc.stress_score / 5, 1);
  const cs = Math.round((carbonNorm * 0.5 + waterNorm * 0.5) * 100);
  const compositeColor = cs >= 70 ? '#ef4444' : cs >= 45 ? '#f97316' : cs >= 25 ? '#fbbf24' : '#2dd4a0';
  return { carbon: carbonColor, water: stressColor, composite: compositeColor, compositeScore: cs };
}

function computeMetrics(dc, carbonPrice, pue) {
  if (!dc) return null;
  const carbonNorm = Math.min(dc.co2_rate / 1600, 1);
  const waterNorm = Math.min(dc.stress_score / 5, 1);
  const compositeScore = Math.round((carbonNorm * 0.5 + waterNorm * 0.5) * 100);
  const carbonCostPerMWh = (dc.co2_rate / 2000) * carbonPrice * pue;
  const annualCarbonCost = carbonCostPerMWh * 8760 * 0.85 * dc.capacity_mw;
  return { compositeScore, carbonCostPerMWh, annualCarbonCost };
}

const formatCost = (num) => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
};

export default function ComparePanel({ dcA, dcB, carbonPrice, pue, onClose, onClear }) {
  const colorsA = getColors(dcA);
  const colorsB = getColors(dcB);
  const metricsA = computeMetrics(dcA, carbonPrice, pue);
  const metricsB = computeMetrics(dcB, carbonPrice, pue);

  const slotStyle = (dc, slot) => ({
    flex: 1,
    textAlign: 'center',
    padding: '10px 8px',
    borderRadius: 8,
    background: dc ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
    border: `1px dashed ${dc ? 'var(--border-active)' : 'var(--border-subtle)'}`,
    position: 'relative',
  });

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 20,
      width: 380,
      maxHeight: 'calc(100vh - 32px)',
      overflowY: 'auto',
      animation: 'slideInLeft 0.3s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: 'var(--panel-padding)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Compare Mode
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {!dcA ? 'Click a data center for Slot A' : !dcB ? 'Click another for Slot B' : 'Side-by-side comparison'}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>✕</button>
        </div>

        {/* Slot Headers */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={slotStyle(dcA, 'A')}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>A</div>
            {dcA ? (
              <>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{dcA.metro || dcA.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{dcA.name}</div>
                <button onClick={() => onClear('A')} style={{
                  position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 4,
                  border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', padding: '8px 0' }}>Click map</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>vs</div>
          <div style={slotStyle(dcB, 'B')}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>B</div>
            {dcB ? (
              <>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{dcB.metro || dcB.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{dcB.name}</div>
                <button onClick={() => onClear('B')} style={{
                  position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 4,
                  border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', padding: '8px 0' }}>Click map</div>
            )}
          </div>
        </div>

        {/* Metrics comparison */}
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <MetricRow
            label="Composite Risk"
            valueA={metricsA ? metricsA.compositeScore : null}
            valueB={metricsB ? metricsB.compositeScore : null}
            unit="/100"
            colorA={colorsA.composite}
            colorB={colorsB.composite}
            higher_is_worse={true}
          />
          <MetricRow
            label="Grid CO₂ Rate"
            valueA={dcA ? dcA.co2_rate.toFixed(0) : null}
            valueB={dcB ? dcB.co2_rate.toFixed(0) : null}
            unit="lb/MWh"
            colorA={colorsA.carbon}
            colorB={colorsB.carbon}
            higher_is_worse={true}
          />
          <MetricRow
            label="Water Stress"
            valueA={dcA ? dcA.stress_score.toFixed(1) : null}
            valueB={dcB ? dcB.stress_score.toFixed(1) : null}
            unit="/5.0"
            colorA={colorsA.water}
            colorB={colorsB.water}
            higher_is_worse={true}
          />
          <MetricRow
            label="Carbon Cost"
            valueA={metricsA ? `$${metricsA.carbonCostPerMWh.toFixed(2)}` : null}
            valueB={metricsB ? `$${metricsB.carbonCostPerMWh.toFixed(2)}` : null}
            unit="/MWh"
            colorA="var(--accent-emerald)"
            colorB="var(--accent-emerald)"
            higher_is_worse={true}
          />
          <MetricRow
            label="Capacity"
            valueA={dcA ? dcA.capacity_mw : null}
            valueB={dcB ? dcB.capacity_mw : null}
            unit="MW"
            colorA="var(--text-primary)"
            colorB="var(--text-primary)"
            higher_is_worse={false}
          />

          {/* Annual cost row — special formatting */}
          {metricsA && metricsB && (
            <div style={{ padding: '12px 0' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
              }}>Est. Annual Carbon Cost</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-amber)' }}>
                    {formatCost(metricsA.annualCarbonCost)}
                  </span>
                </div>
                <div style={{ width: 1, background: 'var(--border-active)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-amber)' }}>
                    {formatCost(metricsB.annualCarbonCost)}
                  </span>
                </div>
              </div>
              {/* Savings callout */}
              {(() => {
                const diff = Math.abs(metricsA.annualCarbonCost - metricsB.annualCarbonCost);
                const cheaper = metricsA.annualCarbonCost < metricsB.annualCarbonCost ? 'A' : 'B';
                return (
                  <div style={{
                    marginTop: 8, padding: '8px 10px', borderRadius: 6,
                    background: 'rgba(45, 212, 160, 0.06)', border: '1px solid rgba(45, 212, 160, 0.15)',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-emerald)' }}>
                      Site {cheaper} saves {formatCost(diff)}/yr in carbon cost
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* eGRID regions */}
        <div style={{
          marginTop: 8, display: 'flex', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            {dcA ? `eGRID: ${dcA.egrid_region}` : ''}
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            {dcB ? `eGRID: ${dcB.egrid_region}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
