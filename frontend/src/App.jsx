import { useState, useEffect } from 'react'
import axios from 'axios'
import MapView from './components/MapView.jsx'
import Sidebar from './components/Sidebar.jsx'
import WardDetailPanel from './components/WardDetailPanel.jsx'
import Header from './components/Header.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

export default function App() {
  const [wardData, setWardData] = useState(null)      // GeoJSON from API
  const [summary, setSummary] = useState(null)         // City summary
  const [selectedWard, setSelectedWard] = useState(null) // Clicked ward
  const [filter, setFilter] = useState('ALL')          // Risk filter
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wardsRes, summaryRes] = await Promise.all([
          axios.get('/api/wards'),
          axios.get('/api/summary')
        ])
        setWardData(wardsRes.data)
        setSummary(summaryRes.data)
      } catch (err) {
        setError('Cannot connect to VARSHA backend. Make sure the Python server is running on port 8000.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter ward GeoJSON based on selected risk level
  const filteredWardData = wardData ? {
    ...wardData,
    features: filter === 'ALL'
      ? wardData.features
      : wardData.features.filter(f => f.properties.risk_level === filter)
  } : null

  if (loading) return <LoadingScreen />

  if (error) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: '16px', padding: '32px'
    }}>
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: '600' }}>Connection Error</div>
      <div style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '500px' }}>{error}</div>
      <code style={{ background: '#1e293b', padding: '12px 20px', borderRadius: '8px', color: '#38bdf8' }}>
        cd backend && uvicorn main:app --reload
      </code>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header summary={summary} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar: filters + ward list */}
        <Sidebar
          wardData={wardData}
          summary={summary}
          filter={filter}
          setFilter={setFilter}
          selectedWard={selectedWard}
          onSelectWard={setSelectedWard}
        />

        {/* Center: Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          {filteredWardData && (
            <MapView
              wardData={filteredWardData}
              selectedWard={selectedWard}
              onSelectWard={setSelectedWard}
            />
          )}
        </div>

        {/* Right Panel: Ward detail (only when a ward is selected) */}
        {selectedWard && (
          <WardDetailPanel
            ward={selectedWard}
            onClose={() => setSelectedWard(null)}
          />
        )}
      </div>
    </div>
  )
}
