import { useState } from 'react'
import { Icons } from '../components/Icons'
import { StatCard } from '../components/StatCard'
import { usersData } from '../data/mockData'

export function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterLanguage, setFilterLanguage] = useState('all')

    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm) ||
            user.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || user.mbuStatus === filterStatus
        const matchesLanguage = filterLanguage === 'all' || user.language.toLowerCase() === filterLanguage
        return matchesSearch && matchesStatus && matchesLanguage
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
                <StatCard icon={Icons.Users} label="Total Users" value={usersData.length} changeType="positive" type="sent" />
                <StatCard icon={Icons.Check} label="MBU Completed" value={usersData.filter(u => u.mbuStatus === 'completed').length} changeType="positive" type="delivered" />
                {/* <StatCard icon={Icons.Eye} label="In Progress" value={usersData.filter(u => u.mbuStatus === 'pending').length} changeType="positive" type="read" /> */}
                <StatCard icon={Icons.XCircle} label="Pending" value={usersData.filter(u => u.mbuStatus === 'failed').length} changeType="negative" type="failed" />
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
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                        >
                            <option value="all">All Languages</option>
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                        </select>
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
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
                            <th>Language</th>
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
                                <td>{user.language}</td>
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
