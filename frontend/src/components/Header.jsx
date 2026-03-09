const RISK_BG = {
  CRITICAL: '#7f1d1d',
  HIGH: '#7c2d12',
  MODERATE: '#713f12',
  LOW: '#14532d',
}

const RISK_COLOR = {
  CRITICAL: '#fca5a5',
  HIGH: '#fdba74',
  MODERATE: '#fde047',
  LOW: '#86efac',
}

export default function Header({ summary }) {
  if (!summary) return null

  const riskBg = RISK_BG[summary.overall_risk_level] || '#1e293b'
  const riskColor = RISK_COLOR[summary.overall_risk_level] || '#f1f5f9'

  return (
    <header style={{
      background: '#0f172a',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
          borderRadius: '10px',
          width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>🌧️</div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '0.05em', color: '#38bdf8' }}>
            VARSHA
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '-2px' }}>
            Vulnerability Assessment & Risk Scoring for Hydrological Analysis
          </div>
        </div>
      </div>

      {/* City Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {[
          { label: 'Total Wards', value: summary.total_wards },
          { label: 'Avg Risk Score', value: `${summary.avg_readiness_score}/100` },
          {
            label: 'Population at Risk',
            value: `${(summary.population_at_risk / 100000).toFixed(1)}L`,
          },
          { label: 'Critical Wards', value: summary.wards_by_risk.critical, danger: true },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: stat.danger ? '#ef4444' : '#f1f5f9',
            }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{stat.label}</div>
          </div>
        ))}

        {/* Overall Risk Badge */}
        <div style={{
          background: riskBg,
          color: riskColor,
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          border: `1px solid ${riskColor}40`,
        }}>
          {summary.overall_risk_level} RISK
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse" style={{
            width: '8px', height: '8px',
            borderRadius: '50%', background: '#22c55e',
          }} />
          <span style={{ fontSize: '11px', color: '#64748b' }}>LIVE</span>
        </div>
      </div>
    </header>
  )
}
