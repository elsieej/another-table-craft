import { useState } from 'react'
import BasicTable from './showcases/BasicTable'
import QueryParamShowcase from './showcases/QueryParamShowcase'

const TABS = [
  { id: 'basic', label: 'Basic table', Component: BasicTable },
  { id: 'query-param', label: 'Query-param state', Component: QueryParamShowcase }
] as const

function App() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('basic')
  const Active = TABS.find((tab) => tab.id === activeTab)?.Component ?? BasicTable

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>another-table-craft demo</h1>

      <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Active />
    </main>
  )
}

export default App
