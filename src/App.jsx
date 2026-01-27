import { useState, useEffect } from 'react'
import { Icons } from './components/Icons'
import { dashboardData } from './data/mockData'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './pages/UsersPage'
import './App.css'

function App() {
  const [data] = useState(dashboardData)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [animatedValues, setAnimatedValues] = useState({
    sent: 0, delivered: 0, read: 0, failed: 0, mbuYes: 0, mbuNo: 0,
    notCompleted: 0, remindersSent: 0, remindersPushed: 0, remindersProgramYes: 0
  })

  const navItems = [
    { id: 'dashboard', icon: Icons.Home, label: 'Dashboard' },
    { id: 'users', icon: Icons.Users, label: 'Users' },
  ]

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedValues({
        sent: Math.round(data.campaign.totalMessages * easeOut),
        delivered: Math.round(data.campaign.delivered * easeOut),
        read: Math.round(data.campaign.read * easeOut),
        failed: Math.round(data.campaign.failed * easeOut),
        mbuYes: Math.round(data.campaign.mbuYes * easeOut),
        mbuNo: Math.round(data.campaign.mbuNo * easeOut),
        notCompleted: Math.round(data.campaign.notCompleted * easeOut),
        remindersSent: Math.round(data.campaign.remindersSent * easeOut),
        remindersPushed: Math.round(data.campaign.remindersPushed * easeOut),
        remindersProgramYes: Math.round(data.campaign.remindersProgramYes * easeOut),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [data])

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">आ</div>
          <div>
            <div className="sidebar-title">Aadhar</div>
            <div className="sidebar-subtitle">Dashboard</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && <DashboardPage data={data} animatedValues={animatedValues} />}
        {currentPage === 'users' && <UsersPage />}
        {currentPage !== 'dashboard' && currentPage !== 'users' && (
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon</h2>
            <p>The {navItems.find(n => n.id === currentPage)?.label} page is under development.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
