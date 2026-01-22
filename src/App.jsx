import { useState, useEffect } from 'react'
import './App.css'

// Dashboard data based on the flowchart requirements
const dashboardData = {
  campaign: {
    name: 'Aadhar MBU Campaign',
    totalMessages: 100,
    delivered: 90,
    flowCompleted: 40,
    notCompleted: 30,
    mbuYes: 25,
    mbuNo: 15
  },
  botLevels: {
    userInput: [
      { level: 3, branch: 'info', type: 'button' },
      { level: 4, branch: 'plandata', type: 'button' },
      { level: 5, branch: 'infoPlan', type: 'button' },
      { level: 5, branch: 'location', type: 'button' }
    ],
    nonUserInput: [
      { level: 3, branch: 'close', type: 'readonly' },
      { level: 6, branch: 'locationBtn', type: 'readonly' },
      { level: 7, branch: 'Remainder', type: 'readonly' }
    ]
  },
  recentCampaigns: [
    { id: 1, name: 'MBU Awareness Drive', status: 'active', sent: 5000, delivered: 4750, response: '68%' },
    { id: 2, name: 'Plan Info Broadcast', status: 'completed', sent: 3200, delivered: 3100, response: '72%' },
    { id: 3, name: 'Location Update', status: 'pending', sent: 1500, delivered: 0, response: '-' }
  ]
}

// SVG Icons
const Icons = {
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  XCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
      <circle cx="12" cy="5" r="2"></circle>
      <path d="M12 7v4"></path>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  ArrowDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  ),
  Broadcast: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  ),
  PlusCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  ),
  TrendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  )
}

// Circular Progress component
function CircularProgress({ percentage, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle
        stroke="#e2e8f0"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="url(#progressGradient)"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  )
}

// Stat Card
function StatCard({ icon: Icon, label, value, change, changeType, type }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon"><Icon /></div>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value.toLocaleString()}</div>
      {change && (
        <div className={`stat-card-change ${changeType}`}>
          {changeType === 'positive' ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}

// Flow Node
function FlowNode({ icon: Icon, iconType, label, value }) {
  return (
    <div className="flow-node">
      <div className={`flow-node-icon ${iconType}`}><Icon /></div>
      <div className="flow-node-content">
        <div className="flow-node-label">{label}</div>
        <div className="flow-node-value">{value.toLocaleString()}</div>
      </div>
    </div>
  )
}

// Level Row
function LevelRow({ level, branch, type }) {
  return (
    <div className="level-row">
      <div className="level-badge">L{level}</div>
      <div className="level-info">
        <div className="level-branch">{branch}</div>
        <span className={`level-type-badge ${type}`}>{type}</span>
      </div>
    </div>
  )
}

// Navigation Items
const navItems = [
  { icon: Icons.Home, label: 'Dashboard', active: true },
  { icon: Icons.Broadcast, label: 'Campaigns', active: false },
  { icon: Icons.Bot, label: 'BOT Flows', active: false },
  { icon: Icons.Users, label: 'Users', active: false },
  { icon: Icons.BarChart, label: 'Analytics', active: false },
  { icon: Icons.Settings, label: 'Settings', active: false }
]

function App() {
  const [data] = useState(dashboardData)
  const [animatedValues, setAnimatedValues] = useState({
    sent: 0, delivered: 0, mbuYes: 0, mbuNo: 0, notCompleted: 0
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
        mbuYes: Math.round(data.campaign.mbuYes * easeOut),
        mbuNo: Math.round(data.campaign.mbuNo * easeOut),
        notCompleted: Math.round(data.campaign.notCompleted * easeOut)
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [data])

  const deliveryRate = Math.round((data.campaign.delivered / data.campaign.totalMessages) * 100)
  const completionRate = Math.round((data.campaign.flowCompleted / data.campaign.delivered) * 100)

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
            {navItems.map((item, index) => (
              <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
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
        <header className="header">
          <div className="header-left">
            <h1>Campaign Overview</h1>
            <p>WhatsApp Aadhar MBU Campaign Analytics</p>
          </div>
          <div className="header-right">
            <div className="header-date">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="header-actions">
              <button className="header-btn"><Icons.Search /></button>
              <button className="header-btn"><Icons.Bell /></button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon={Icons.Send} label="Messages Sent" value={animatedValues.sent} change="+12% from last week" changeType="positive" type="sent" />
          <StatCard icon={Icons.Check} label="Delivered" value={animatedValues.delivered} change={`${deliveryRate}% delivery rate`} changeType="positive" type="delivered" />
          <StatCard icon={Icons.Eye} label="Flow Completed" value={data.campaign.flowCompleted} change={`${completionRate}% completion`} changeType="positive" type="read" />
          <StatCard icon={Icons.XCircle} label="Not Completed" value={animatedValues.notCompleted} change="Incomplete flows" changeType="negative" type="failed" />
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Flow Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><Icons.Broadcast /></div>
                Campaign Message Flow
              </div>
              <span className="card-badge">Live</span>
            </div>
            <div className="flow-chart">
              <div className="flow-row">
                <FlowNode icon={Icons.Send} iconType="sent" label="Total Sent" value={data.campaign.totalMessages} />
                <div className="flow-arrow"><Icons.ArrowRight /></div>
                <FlowNode icon={Icons.Check} iconType="delivered" label="Delivered" value={data.campaign.delivered} />
              </div>
              <div className="flow-vertical">
                <div className="flow-connector"></div>
                <Icons.ArrowDown />
              </div>
              <div className="branch-container">
                <div className="branch-item">
                  <div className="branch-dot"></div>
                  <span className="branch-label">Flow Completed</span>
                  <span className="branch-value">{data.campaign.flowCompleted}</span>
                </div>
                <div className="branch-item negative">
                  <div className="branch-dot"></div>
                  <span className="branch-label">Not Completed</span>
                  <span className="branch-value">{data.campaign.notCompleted}</span>
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-header">
                  <span className="progress-label">Flow Completion Rate</span>
                  <span className="progress-value">{completionRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* MBU Status */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><Icons.BarChart /></div>
                MBU Response
              </div>
            </div>
            <div className="response-chart">
              <CircularProgress percentage={Math.round((data.campaign.mbuYes / data.campaign.flowCompleted) * 100)} />
              <div className="response-chart-center">
                <div className="response-chart-value">{Math.round((data.campaign.mbuYes / data.campaign.flowCompleted) * 100)}%</div>
                <div className="response-chart-label">MBU Yes Rate</div>
              </div>
            </div>
            <div className="mbu-grid">
              <div className="mbu-card yes">
                <div className="mbu-value">{animatedValues.mbuYes}</div>
                <div className="mbu-label">MBU - Yes</div>
              </div>
              <div className="mbu-card no">
                <div className="mbu-value">{animatedValues.mbuNo}</div>
                <div className="mbu-label">MBU - No</div>
              </div>
              <div className="mbu-card not-completed">
                <div className="mbu-value">{animatedValues.notCompleted}</div>
                <div className="mbu-label">Not Completed</div>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color mbu-yes"></div>
                  <span className="legend-text">MBU Accepted</span>
                  <span className="legend-value">{data.campaign.mbuYes}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color mbu-no"></div>
                  <span className="legend-text">MBU Rejected</span>
                  <span className="legend-value">{data.campaign.mbuNo}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color not-complete"></div>
                  <span className="legend-text">Incomplete</span>
                  <span className="legend-value">{data.campaign.notCompleted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><Icons.Bot /></div>
                User Input Levels
              </div>
              <span className="card-badge">Interactive</span>
            </div>
            <div className="levels-table">
              {data.botLevels.userInput.map((level, index) => (
                <LevelRow key={index} level={level.level} branch={level.branch} type={level.type} />
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><Icons.FileText /></div>
                Read-Only Nodes
              </div>
              <span className="card-badge">Automated</span>
            </div>
            <div className="levels-table">
              {data.botLevels.nonUserInput.map((level, index) => (
                <LevelRow key={index} level={level.level} branch={level.branch} type={level.type} />
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><Icons.Settings /></div>
                Quick Actions
              </div>
            </div>
            <div className="quick-actions">
              <div className="action-btn"><div className="action-icon"><Icons.PlusCircle /></div><span className="action-label">New Campaign</span></div>
              <div className="action-btn"><div className="action-icon"><Icons.Broadcast /></div><span className="action-label">Broadcast</span></div>
              <div className="action-btn"><div className="action-icon"><Icons.Users /></div><span className="action-label">Manage Users</span></div>
              <div className="action-btn"><div className="action-icon"><Icons.Download /></div><span className="action-label">Export Data</span></div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon"><Icons.FileText /></div>
              Recent Campaigns
            </div>
          </div>
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Response Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td style={{ fontWeight: 500 }}>{campaign.name}</td>
                  <td><span className={`status-badge ${campaign.status}`}>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span></td>
                  <td>{campaign.sent.toLocaleString()}</td>
                  <td>{campaign.delivered.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: campaign.response !== '-' ? 'var(--accent-green)' : 'var(--text-muted)' }}>{campaign.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
