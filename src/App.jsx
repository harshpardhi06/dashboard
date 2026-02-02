import { useState, useEffect } from 'react'
import { Icons } from './components/Icons'
import { dashboardData, usersData } from './data/mockData'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './pages/UsersPage'
import { LoginPage } from './pages/LoginPage'
import './App.css'

const navItems = [
  { id: 'dashboard', icon: Icons.Home, label: 'Dashboard' },
  // { id: 'users', icon: Icons.Users, label: 'Users' },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [data] = useState(dashboardData)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [animatedValues, setAnimatedValues] = useState({
    sent: 0, delivered: 0, read: 0, failed: 0, mbuYes: 0, mbuNo: 0,
    notNow: 0, remindersSent: 0, remindersPushed: 0, remindersProgramYes: 0,
    remindersDelivered: 0, remindersRead: 0,
    eng: 0, hin: 0, mar: 0,
    formalTotal: 0, formalEng: 0, formalHin: 0,
    informalTotal: 0, informalEng: 0, informalHin: 0,
    video: 0, poster: 0
  })

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
        notNow: Math.round(data.campaign.mbuNotNow * easeOut),
        remindersSent: Math.round(data.campaign.remindersSent * easeOut),
        remindersPushed: Math.round(data.campaign.remindersPushed * easeOut),
        remindersDelivered: Math.round(data.campaign.remindersDelivered * easeOut),
        remindersRead: Math.round(data.campaign.remindersRead * easeOut),
        remindersProgramYes: Math.round(data.campaign.remindersProgramYes * easeOut),
        eng: Math.round(data.campaign.languages.english * easeOut),
        hin: Math.round(data.campaign.languages.hindi * easeOut),
        mar: Math.round(data.campaign.languages.marathi * easeOut),
        formalTotal: Math.round(data.campaign.formats.formal.total * easeOut),
        formalEng: Math.round(data.campaign.formats.formal.english * easeOut),
        formalHin: Math.round(data.campaign.formats.formal.hindi * easeOut),
        informalTotal: Math.round(data.campaign.formats.informal.total * easeOut),
        informalEng: Math.round(data.campaign.formats.informal.english * easeOut),
        informalHin: Math.round(data.campaign.formats.informal.hindi * easeOut),
        video: Math.round(data.campaign.assetsPushed.video * easeOut),
        poster: Math.round(data.campaign.assetsPushed.poster * easeOut),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [data])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

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
          <div className="user-profile" onClick={handleLogout} title="Click to logout">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
            <div className="logout-icon" style={{ marginLeft: 'auto', opacity: 0.6 }}>
              <Icons.Home /> {/* Using an icon as a placeholder for logout if specific logout icon is missing */}
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
