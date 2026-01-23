import { useState, useEffect } from 'react'
import './App.css'

// Dashboard data based on the flowchart requirements
const dashboardData = {
  campaign: {
    name: 'Aadhar MBU Campaign',
    totalMessages: 150000,
    delivered: 100000,
    flowCompleted: 50000,
    notCompleted: 50000,
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

// Users data
const usersData = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', aadhar: 'XXXX-XXXX-1234', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Mumbai', flowStatus: 'MBU - Yes' },
  { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', aadhar: 'XXXX-XXXX-5678', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Delhi', flowStatus: 'MBU - Yes' },
  { id: 3, name: 'Amit Patel', phone: '+91 76543 21098', aadhar: 'XXXX-XXXX-9012', mbuStatus: 'pending', lastActive: '2026-01-21', location: 'Ahmedabad', flowStatus: 'In Progress' },
  { id: 4, name: 'Sneha Reddy', phone: '+91 65432 10987', aadhar: 'XXXX-XXXX-3456', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Hyderabad', flowStatus: 'MBU - No' },
  { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', aadhar: 'XXXX-XXXX-7890', mbuStatus: 'failed', lastActive: '2026-01-20', location: 'Jaipur', flowStatus: 'Not Completed' },
  { id: 6, name: 'Ananya Iyer', phone: '+91 43210 98765', aadhar: 'XXXX-XXXX-2345', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Chennai', flowStatus: 'MBU - Yes' },
  { id: 7, name: 'Rahul Gupta', phone: '+91 32109 87654', aadhar: 'XXXX-XXXX-6789', mbuStatus: 'pending', lastActive: '2026-01-21', location: 'Kolkata', flowStatus: 'In Progress' },
  { id: 8, name: 'Kavita Menon', phone: '+91 21098 76543', aadhar: 'XXXX-XXXX-0123', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Kochi', flowStatus: 'MBU - Yes' },
  { id: 9, name: 'Suresh Nair', phone: '+91 10987 65432', aadhar: 'XXXX-XXXX-4567', mbuStatus: 'failed', lastActive: '2026-01-19', location: 'Bangalore', flowStatus: 'Not Completed' },
  { id: 10, name: 'Deepa Verma', phone: '+91 09876 54321', aadhar: 'XXXX-XXXX-8901', mbuStatus: 'completed', lastActive: '2026-01-22', location: 'Pune', flowStatus: 'MBU - Yes' },
]

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
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
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
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  MoreVertical: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
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
      <circle stroke="#e2e8f0" fill="none" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
      <circle stroke="url(#progressGradient)" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }} />
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

// Users Page Component
function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.mbuStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'active'
      case 'pending': return 'pending'
      case 'failed': return 'failed'
      default: return ''
    }
  }

  const getFlowStatusClass = (flowStatus) => {
    if (flowStatus.includes('Yes')) return 'flow-yes'
    if (flowStatus.includes('No')) return 'flow-no'
    if (flowStatus.includes('Progress')) return 'flow-pending'
    return 'flow-failed'
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>User Management</h1>
          <p>Manage Aadhar MBU campaign users</p>
        </div>
        <div className="header-right">
          <div className="header-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatCard icon={Icons.Users} label="Total Users" value={usersData.length} change="+5 this week" changeType="positive" type="sent" />
        <StatCard icon={Icons.Check} label="MBU Completed" value={usersData.filter(u => u.mbuStatus === 'completed').length} change="60% completion" changeType="positive" type="delivered" />
        <StatCard icon={Icons.Eye} label="In Progress" value={usersData.filter(u => u.mbuStatus === 'pending').length} change="Active users" changeType="positive" type="read" />
        <StatCard icon={Icons.XCircle} label="Not Completed" value={usersData.filter(u => u.mbuStatus === 'failed').length} change="Need follow-up" changeType="negative" type="failed" />
      </div>

      {/* Users Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon"><Icons.Users /></div>
            All Users
          </div>
          <div className="table-actions">
            <div className="search-box">
              <Icons.Search />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className="btn-primary">
              <Icons.PlusCircle />
              Add User
            </button>
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Aadhar</th>
              <th>Location</th>
              <th>MBU Status</th>
              <th>Flow Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">{user.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className="user-name-cell">{user.name}</span>
                  </div>
                </td>
                <td>
                  <div className="phone-cell">
                    <Icons.Phone />
                    {user.phone}
                  </div>
                </td>
                <td><span className="aadhar-masked">{user.aadhar}</span></td>
                <td>
                  <div className="location-cell">
                    <Icons.MapPin />
                    {user.location}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(user.mbuStatus)}`}>
                    {user.mbuStatus.charAt(0).toUpperCase() + user.mbuStatus.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`flow-badge ${getFlowStatusClass(user.flowStatus)}`}>
                    {user.flowStatus}
                  </span>
                </td>
                <td className="date-cell">{user.lastActive}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit"><Icons.Edit /></button>
                    <button className="icon-btn delete"><Icons.Trash /></button>
                    <button className="icon-btn more"><Icons.MoreVertical /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <span className="table-info">Showing {filteredUsers.length} of {usersData.length} users</span>
          <div className="pagination">
            <button className="page-btn" disabled>Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </>
  )
}

// Dashboard Page Component
function DashboardPage({ data, animatedValues }) {
  const deliveryRate = Math.round((data.campaign.delivered / data.campaign.totalMessages) * 100)
  const completionRate = Math.round((data.campaign.flowCompleted / data.campaign.delivered) * 100)

  return (
    <>
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
      {/* <div className="bottom-grid">
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
      </div> */}

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
    </>
  )
}

function App() {
  const [data] = useState(dashboardData)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [animatedValues, setAnimatedValues] = useState({
    sent: 0, delivered: 0, mbuYes: 0, mbuNo: 0, notCompleted: 0
  })

  const navItems = [
    { id: 'dashboard', icon: Icons.Home, label: 'Dashboard' },
    // { id: 'campaigns', icon: Icons.Broadcast, label: 'Campaigns' },
    // { id: 'bot', icon: Icons.Bot, label: 'BOT Flows' },
    { id: 'users', icon: Icons.Users, label: 'Users' },
    // { id: 'analytics', icon: Icons.BarChart, label: 'Analytics' },
    // { id: 'settings', icon: Icons.Settings, label: 'Settings' }
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
        mbuYes: Math.round(data.campaign.mbuYes * easeOut),
        mbuNo: Math.round(data.campaign.mbuNo * easeOut),
        notCompleted: Math.round(data.campaign.notCompleted * easeOut)
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
