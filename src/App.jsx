import { useState, useEffect } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import './App.css'
import { ReportsPage } from './pages/ReportsPage'

const navItems = [
  { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
  { id: 'reports', icon: GroupIcon, label: 'Reports' },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Admin User')
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('lastPage') || 'dashboard')


  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('lastPage', currentPage)
    }
  }, [currentPage, isLoggedIn])

  const handleLogin = () => {
    setIsLoggedIn(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
  }



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastPage');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };


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
            <div className="user-icon" style={{
              width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">Administrator</div>
            </div>
            <div className="logout-icon" style={{ marginLeft: 'auto' }}>
              <LogoutIcon />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && <DashboardPage userName={userName} />}
        {currentPage === 'users' && <UsersPage />}
        {currentPage === 'reports' && <ReportsPage />}

        {currentPage !== 'dashboard' && currentPage !== 'reports' && (
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
