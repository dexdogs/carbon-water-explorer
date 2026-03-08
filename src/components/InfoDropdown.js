'use client';

import { useState } from 'react';

export default function InfoDropdown({ onClose }) {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');

  const handleSubmitFeedback = () => {
    const subject = encodeURIComponent(`[Carbon Explorer] ${feedbackType} feedback from ${feedbackName || 'Anonymous'}`);
    const body = encodeURIComponent(`Name: ${feedbackName || 'Anonymous'}\nType: ${feedbackType}\n\n${feedbackMessage}`);
    window.open(`mailto:ankur@dexdogs.earth?subject=${subject}&body=${body}`, '_blank');
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid var(--border-active)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    outline: 'none',
  };

  return (
    <div style={{
      position: 'absolute',
      top: 70,
      left: 16,
      zIndex: 30,
      width: 360,
      maxHeight: 'calc(100vh - 86px)',
      overflowY: 'auto',
      animation: 'fadeInUp 0.3s ease-out',
    }}>
      <div className="glass-panel" style={{ padding: 'var(--panel-padding)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Info & Feedback
          </h2>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>✕</button>
        </div>

        {/* Dexdogs CTA */}
        <a
          href="https://dexdogs.earth"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '16px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(45, 212, 160, 0.08) 0%, rgba(34, 211, 238, 0.08) 100%)',
            border: '1px solid rgba(45, 212, 160, 0.2)',
            textDecoration: 'none',
            marginBottom: 20,
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            dexdogs.earth
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}>
            Go to dexdogs.earth for more info on carbon markets, industrial decarbonization, and measurement infrastructure.
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent-emerald)',
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Visit site →
          </div>
        </a>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

        {/* Feedback Form */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}>
            Send Feedback
          </div>

          {/* Name */}
          <div style={{ marginBottom: 10 }}>
            <label style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              display: 'block', marginBottom: 4,
            }}>Name (optional)</label>
            <input
              type="text"
              value={feedbackName}
              onChange={e => setFeedbackName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          {/* Feedback type */}
          <div style={{ marginBottom: 10 }}>
            <label style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              display: 'block', marginBottom: 4,
            }}>Type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['general', 'bug', 'data', 'feature'].map(type => (
                <button
                  key={type}
                  onClick={() => setFeedbackType(type)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: feedbackType === type ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    background: feedbackType === type ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                    color: feedbackType === type ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 12 }}>
            <label style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              display: 'block', marginBottom: 4,
            }}>Message</label>
            <textarea
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
              placeholder="Your feedback, suggestions, or data corrections..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 80,
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitFeedback}
            disabled={!feedbackMessage.trim()}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: feedbackMessage.trim()
                ? 'linear-gradient(135deg, #2dd4a0 0%, #22d3ee 100%)'
                : 'rgba(255,255,255,0.06)',
              color: feedbackMessage.trim() ? '#0a0e14' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 700,
              cursor: feedbackMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            Send via Email
          </button>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            marginTop: 6,
            textAlign: 'center',
          }}>
            Opens your email client to send to ankur@dexdogs.earth
          </p>
        </div>
      </div>
    </div>
  );
}
