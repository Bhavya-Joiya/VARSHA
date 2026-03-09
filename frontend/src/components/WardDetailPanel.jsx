function ScoreGauge({ label, value, color, description }) {
  const circumference = 2 * Math.PI * 28
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Background circle */}
        <circle cx="36" cy="36" r="28" fill="none" stroke="#1e293b" strokeWidth="7" />
        {/* Progress circle */}
        <circle
          cx="36" cy="36" r="28"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="36" y="40" textAnchor="middle" fill={color} fontSize="15" fontWeight="800">
          {value}
        </text>
      </svg>
      <div style={{ fontSize: '11px', fontWeight: '700', color, textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', maxWidth: '72px' }}>{description}</div>
    </div>
  )
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #1e293b',
    }}>
      <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
      <span style={{
        fontSize: '12px', fontWeight: '600',
        color: highlight ? '#f97316' : '#f1f5f9',
      }}>{value}</span>
    </div>
  )
}

const RISK_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MODERATE: '#eab308',
  LOW: '#22c55e',
}

const RISK_BG = {
  CRITICAL: 'rgba(239,68,68,0.1)',
  HIGH: 'rgba(249,115,22,0.1)',
  MODERATE: 'rgba(234,179,8,0.1)',
  LOW: 'rgba(34,197,94,0.1)',
}

export default function WardDetailPanel({ ward, onClose }) {
  if (!ward) return null

  const riskColor = RISK_COLORS[ward.risk_level] || '#f1f5f9'
  const riskBg = RISK_BG[ward.risk_level] || '#1e293b'

  return (
    <div
      className="slide-in"
      style={{
        width: '320px',
        flexShrink: 0,
        background: '#0f172a',
        borderLeft: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #1e293b',
        background: riskBg,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9' }}>
              {ward.name}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {ward.district} District • Ward #{ward.id}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              borderRadius: '6px',
              width: '28px', height: '28px',
              fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Overall Score Banner */}
        <div style={{
          marginTop: '12px',
          background: `${riskColor}22`,
          border: `1px solid ${riskColor}44`,
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>OVERALL READINESS SCORE</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: riskColor, lineHeight: 1 }}>
              {ward.overall_score}
              <span style={{ fontSize: '14px', color: '#64748b' }}>/100</span>
            </div>
          </div>
          <div style={{
            background: riskColor,
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '0.08em',
          }}>
            {ward.risk_level}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* 3 Score Gauges */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '12px' }}>
            SCORE BREAKDOWN
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <ScoreGauge
              label="FVI"
              value={ward.fvi}
              color="#ef4444"
              description="Flood Vulnerability"
            />
            <ScoreGauge
              label="DHS"
              value={ward.dhs}
              color="#f97316"
              description="Drainage Health"
            />
            <ScoreGauge
              label="RRI"
              value={ward.rri}
              color="#a855f7"
              description="Response Readiness"
            />
          </div>
        </div>

        {/* Key Facts */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '8px' }}>
            WARD PROFILE
          </div>
          <InfoRow label="Population" value={ward.population.toLocaleString('en-IN')} />
          <InfoRow label="Area" value={`${ward.area_sqkm} km²`} />
          <InfoRow
            label="Historical Flood Events"
            value={`${ward.historical_floods} (2014–2024)`}
            highlight={ward.historical_floods >= 6}
          />
          <InfoRow
            label="Water Body Proximity"
            value={ward.near_water_body ? ward.water_body : 'None'}
            highlight={ward.near_water_body}
          />
          <InfoRow
            label="Drainage Network"
            value={`${ward.drainage_pipes_km} km`}
          />
          <InfoRow
            label="Infrastructure Age"
            value={`${ward.dhs_detail?.age_component > 50 ? '🔴 ' : ''}${ward.name === ward.name ? (ward.dhs_detail?.age_component > 60 ? '35+ years' : ward.dhs_detail?.age_component > 40 ? '20-35 years' : '< 20 years') : 'N/A'}`}
            highlight={ward.dhs_detail?.age_component > 50}
          />
        </div>

        {/* Known Flood Hotspots */}
        {ward.known_hotspots && ward.known_hotspots.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '8px' }}>
              KNOWN FLOOD HOTSPOTS
            </div>
            {ward.known_hotspots.map((spot, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 10px',
                background: '#1e293b',
                borderRadius: '6px',
                marginBottom: '4px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}>
                <span>📍</span>
                <span>{spot}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '8px' }}>
            PRE-MONSOON RECOMMENDATIONS
          </div>
          {ward.recommendations.map((rec, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              background: '#1e293b',
              borderRadius: '8px',
              marginBottom: '6px',
              fontSize: '12px',
              color: '#e2e8f0',
              lineHeight: '1.5',
              borderLeft: `3px solid ${
                rec.startsWith('🔴') ? '#ef4444' :
                rec.startsWith('🟠') ? '#f97316' :
                rec.startsWith('⚠️') ? '#eab308' :
                rec.startsWith('✅') ? '#22c55e' :
                '#475569'
              }`,
            }}>
              {rec}
            </div>
          ))}
        </div>

        {/* Data Sources Footer */}
        <div style={{
          padding: '10px',
          background: '#1e293b',
          borderRadius: '8px',
          fontSize: '10px',
          color: '#475569',
        }}>
          <strong style={{ color: '#64748b' }}>Data Sources:</strong>{' '}
          IMD Historical Rainfall • SRTM Elevation (NASA) • NDMA Flood Records • OpenStreetMap Drainage Network
        </div>
      </div>
    </div>
  )
}
