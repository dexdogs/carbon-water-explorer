'use client';

export default function Header({ showInfo, setShowInfo, showMethodology, setShowMethodology }) {
  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      animation: 'fadeInUp 0.5s ease-out',
    }}>
      <div className="glass-panel" style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #2dd4a0 0%, #22d3ee 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0e14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        <div>
          <h1 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>
            Carbon + Water Stress Explorer
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
            SASB TC-SI-130a · EPA eGRID · WRI Aqueduct
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
          <button
            onClick={() => { setShowMethodology(prev => !prev); setShowInfo(false); }}
            title="Methodology & Equations"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: showMethodology ? 'rgba(45, 212, 160, 0.12)' : 'transparent',
              color: showMethodology ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            fx
          </button>
          <button
            onClick={() => { setShowInfo(prev => !prev); setShowMethodology(false); }}
            title="Info & Feedback"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: showInfo ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
              color: showInfo ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              transition: 'all 0.2s ease',
            }}
          >
            i
          </button>
        </div>
      </div>
    </div>
  );
}
