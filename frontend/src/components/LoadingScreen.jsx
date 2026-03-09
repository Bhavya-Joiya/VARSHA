export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f172a',
      gap: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
        borderRadius: '20px',
        width: '72px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '36px',
        animation: 'pulse 1.5s infinite',
      }}>🌧️</div>

      <div>
        <div style={{
          fontSize: '28px',
          fontWeight: '900',
          letterSpacing: '0.1em',
          color: '#38bdf8',
          textAlign: 'center',
        }}>VARSHA</div>
        <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>
          Loading flood intelligence data...
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        width: '200px',
        height: '3px',
        background: '#1e293b',
        borderRadius: '999px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #1d4ed8, #0ea5e9)',
          borderRadius: '999px',
          animation: 'loadingBar 1.5s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
