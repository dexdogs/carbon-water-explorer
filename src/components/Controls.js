'use client';

const layerOptions = [
  { id: 'composite', label: 'Composite Risk', icon: '◈' },
  { id: 'carbon', label: 'Carbon Intensity', icon: '⬡' },
  { id: 'water', label: 'Water Stress', icon: '◉' },
];

export default function Controls({ carbonPrice, setCarbonPrice, activeLayer, setActiveLayer, pue, setPue, compareMode, onToggleCompare }) {
  return (
    <div style={{
      position: 'absolute',
      top: 80,
      left: 16,
      zIndex: 10,
      width: 280,
      animation: 'fadeInUp 0.6s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: 'var(--panel-padding)' }}>

        {/* Layer Toggle */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 8,
          }}>
            View Layer
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {layerOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setActiveLayer(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: activeLayer === opt.id ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                  background: activeLayer === opt.id ? 'rgba(45, 212, 160, 0.08)' : 'transparent',
                  color: activeLayer === opt.id ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 14, opacity: 0.7 }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carbon Price Slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}>
            <label style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Carbon Price
            </label>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--accent-emerald)',
            }}>
              ${carbonPrice}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>/ton</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={250}
            step={5}
            value={carbonPrice}
            onChange={e => setCarbonPrice(Number(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              appearance: 'none',
              background: `linear-gradient(to right, var(--accent-emerald) 0%, var(--accent-emerald) ${(carbonPrice / 250) * 100}%, var(--border-active) ${(carbonPrice / 250) * 100}%, var(--border-active) 100%)`,
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>$0</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>$250</span>
          </div>
        </div>

        {/* PUE Slider */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}>
            <label style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              PUE
            </label>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--accent-cyan)',
            }}>
              {pue.toFixed(2)}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>x</span>
            </span>
          </div>
          <input
            type="range"
            min={1.0}
            max={2.5}
            step={0.05}
            value={pue}
            onChange={e => setPue(Number(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              appearance: 'none',
              background: `linear-gradient(to right, var(--accent-cyan) 0%, var(--accent-cyan) ${((pue - 1.0) / 1.5) * 100}%, var(--border-active) ${((pue - 1.0) / 1.5) * 100}%, var(--border-active) 100%)`,
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>1.00</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>2.50</span>
          </div>
        </div>

        {/* Compare Mode Toggle */}
        <button
          onClick={onToggleCompare}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid',
            borderColor: compareMode ? 'var(--accent-cyan)' : 'var(--border-subtle)',
            background: compareMode ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
            color: compareMode ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 14 }}>⇋</span>
          {compareMode ? 'Exit Compare' : 'Compare A / B'}
        </button>

        {/* Context note */}
        <div style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}>
            PUE (Power Usage Effectiveness) multiplies grid energy by facility overhead. Industry avg ~1.58, hyperscale ~1.1–1.3.
          </p>
        </div>
      </div>
    </div>
  );
}
