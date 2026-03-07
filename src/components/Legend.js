'use client';

export default function Legend({ activeLayer }) {
  const carbonStops = [
    { color: '#2dd4a0', label: '<400' },
    { color: '#86efac', label: '600' },
    { color: '#fbbf24', label: '900' },
    { color: '#f97316', label: '1200' },
    { color: '#ef4444', label: '>1400' },
  ];

  const waterStops = [
    { color: '#38bdf8', label: 'Low' },
    { color: '#67e8f9', label: 'Low-Med' },
    { color: '#fbbf24', label: 'Medium' },
    { color: '#fb923c', label: 'High' },
    { color: '#dc2626', label: 'Extreme' },
  ];

  const compositeStops = [
    { color: '#2dd4a0', label: 'Low Risk' },
    { color: '#86efac', label: '' },
    { color: '#fbbf24', label: 'Moderate' },
    { color: '#f97316', label: '' },
    { color: '#ef4444', label: 'High Risk' },
  ];

  const stops = activeLayer === 'carbon' ? carbonStops
    : activeLayer === 'water' ? waterStops
    : compositeStops;

  const units = activeLayer === 'carbon' ? 'lb CO₂/MWh'
    : activeLayer === 'water' ? 'Baseline Water Stress'
    : 'Composite Score';

  return (
    <div style={{
      position: 'absolute',
      bottom: 32,
      left: 16,
      zIndex: 10,
      animation: 'fadeInUp 0.7s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: '12px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          {units}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {stops.map((stop, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                height: 6,
                background: stop.color,
                borderRadius: i === 0 ? '3px 0 0 3px' : i === stops.length - 1 ? '0 3px 3px 0' : 0,
                minWidth: 40,
              }} />
              {stop.label && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}>
                  {stop.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
