const RISK_LEVELS = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW']

const RISK_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MODERATE: '#eab308',
  LOW: '#22c55e',
  ALL: '#38bdf8',
}

const RISK_EMOJI = {
  CRITICAL: '🔴',
  HIGH: '🟠',
  MODERATE: '🟡',
  LOW: '🟢',
}

function ScoreBar({ value, color }) {
  return (
    <div style={{
      background: '#1e293b', borderRadius: '999px',
      height: '4px', width: '60px', overflow: 'hidden',
    }}>
      <div style={{
        width: `${value}%`, height: '100%',
        background: color, borderRadius: '999px',
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

export default function Sidebar({ wardData, summary, filter, setFilter, selectedWard, onSelectWard }) {
  if (!wardData || !summary) return null

  const wards = wardData.features
    .map(f => f.properties)
    .sort((a, b) => b.overall_score - a.overall_score)

  const filtered = filter === 'ALL' ? wards : wards.filter(w => w.risk_level === filter)

  return (
    <aside style={{
      width: '280px',
      background: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Risk Distribution */}
      <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', letterSpacing: '0.1em' }}>
          RISK DISTRIBUTION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {['critical', 'high', 'moderate', 'low'].map(level => (
            <div key={level} style={{
              background: '#1e293b',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              border: filter === level.toUpperCase() ? `1px solid ${RISK_COLORS[level.toUpperCase()]}` : '1px solid transparent',
              transition: 'border 0.2s',
            }}
              onClick={() => setFilter(filter === level.toUpperCase() ? 'ALL' : level.toUpperCase())}
            >
              <div style={{ fontSize: '20px', fontWeight: '700', color: RISK_COLORS[level.toUpperCase()] }}>
                {summary.wards_by_risk[level]}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'capitalize' }}>{level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {RISK_LEVELS.map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
              background: filter === level ? RISK_COLORS[level] : '#1e293b',
              color: filter === level ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Ward Count */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Showing <strong style={{ color: '#f1f5f9' }}>{filtered.length}</strong> wards
        </span>
      </div>

      {/* Ward List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(ward => (
          <div
            key={ward.id}
            onClick={() => onSelectWard(ward)}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #1e293b',
              cursor: 'pointer',
              background: selectedWard?.id === ward.id ? '#1e293b' : 'transparent',
              borderLeft: selectedWard?.id === ward.id
                ? `3px solid ${RISK_COLORS[ward.risk_level]}`
                : '3px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (selectedWard?.id !== ward.id) e.currentTarget.style.background = '#1a2744' }}
            onMouseLeave={e => { if (selectedWard?.id !== ward.id) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#f1f5f9' }}>
                  {RISK_EMOJI[ward.risk_level]} {ward.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {ward.district}
                </div>
              </div>
              <div style={{
                background: `${ward.risk_color}22`,
                color: ward.risk_color,
                fontSize: '14px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '6px',
                border: `1px solid ${ward.risk_color}44`,
              }}>
                {ward.overall_score}
              </div>
            </div>

            {/* Mini score bars */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {[
                { label: 'FVI', val: ward.fvi, color: '#ef4444' },
                { label: 'DHS', val: ward.dhs, color: '#f97316' },
                { label: 'RRI', val: ward.rri, color: '#a855f7' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '9px', color: '#475569' }}>{s.label}</span>
                  <ScoreBar value={s.val} color={s.color} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
