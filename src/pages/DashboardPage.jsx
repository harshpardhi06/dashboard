import { useState } from 'react'
import { Icons } from '../components/Icons'
import { StatCard } from '../components/StatCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export function DashboardPage({ data, animatedValues }) {
    const [templateFilter, setTemplateFilter] = useState('All')
    const [languageFilter, setLanguageFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('')

    const deliveryRate = Math.round((data.campaign.delivered / data.campaign.totalMessages) * 100)
    const completionRate = Math.round((data.campaign.flowCompleted / data.campaign.delivered) * 100)

    const filteredCampaigns = data.recentCampaigns
        .filter(c => (templateFilter === 'All' || c.templateName === templateFilter))
        .filter(c => (languageFilter === 'All' || c.language === languageFilter))
        .filter(c => (dateFilter === '' || c.date === dateFilter))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const mbuTotal = data.campaign.mbuYes + data.campaign.mbuNo + data.campaign.mbuNotNow
    const mbuResponseRate = ((mbuTotal / data.campaign.delivered) * 100).toFixed(1)

    const reminderTotal = data.campaign.remindersSent
    const reminderDeliveryRate = ((data.campaign.remindersDelivered / reminderTotal) * 100).toFixed(1)

    const chartData = [
        { name: 'MBU Yes', value: data.campaign.mbuYes, color: '#10b981' },
        { name: 'MBU No', value: data.campaign.mbuNo, color: '#ef4444' },
        { name: 'Not Now', value: data.campaign.mbuNotNow, color: '#f59e0b' },
    ]

    const reminderChartData = [
        { name: 'Read', value: data.campaign.remindersRead, color: '#0ea5e9' },
        { name: 'Delivered', value: data.campaign.remindersDelivered - data.campaign.remindersRead, color: '#6366f1' },
        { name: 'Failed', value: data.campaign.remindersSent - data.campaign.remindersDelivered, color: '#f43f5e' },
    ]

    const CustomTooltip = ({ active, payload, total }) => {
        if (active && payload && payload.length) {
            const currentTotal = total || mbuTotal
            const percentage = ((payload[0].value / currentTotal) * 100).toFixed(1)
            return (
                <div className="custom-tooltip" style={{
                    background: 'white',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{payload[0].name}</p>
                    <p style={{ margin: 0, color: payload[0].payload.color, fontWeight: 700 }}>{payload[0].value.toLocaleString()} ({percentage}%)</p>
                </div>
            )
        }
        return null
    }

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
                <StatCard icon={Icons.Send} label="Sent Messages" value={animatedValues.sent} changeType="positive" type="sent" />
                <StatCard icon={Icons.Check} label="Delivered Messages" value={animatedValues.delivered} changeType="positive" type="delivered" />
                <StatCard icon={Icons.Eye} label="Read Messages" value={animatedValues.read} changeType="positive" type="read" />
                <StatCard icon={Icons.XCircle} label="Failed Messages" value={animatedValues.failed} changeType="negative" type="failed" />
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header">
                    <div className="card-title">
                        <div className="card-title-icon"><Icons.FileText /></div>
                        Campaign History
                    </div>
                    <div className="table-actions">
                        <input
                            type="date"
                            className="filter-select"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={languageFilter}
                            onChange={(e) => setLanguageFilter(e.target.value)}
                        >
                            <option value="All">All Languages</option>
                            <option value="Hindi">Hindi</option>
                            <option value="English">English</option>
                        </select>
                        <select
                            className="filter-select"
                            value={templateFilter}
                            onChange={(e) => setTemplateFilter(e.target.value)}
                        >
                            <option value="All">All Templates</option>
                            <option value="Formal">Formal</option>
                            <option value="Informal">Informal</option>
                        </select>
                        {dateFilter && (
                            <button
                                className="icon-btn"
                                onClick={() => setDateFilter('')}
                                title="Clear date filter"
                                style={{ height: '38px', padding: '0 10px' }}
                            >
                                <Icons.XCircle size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="table-container">
                    <table className="campaign-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Campaign Name</th>
                                <th>Language</th>
                                <th>Template</th>
                                <th>Total</th>
                                <th>Sent</th>
                                <th>Delivered</th>
                                <th>Read</th>
                                <th>Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.map(campaign => (
                                <tr key={campaign.id}>
                                    <td className="date-cell">{campaign.date}</td>
                                    <td style={{ fontWeight: 500 }}>{campaign.name}</td>
                                    <td>{campaign.language}</td>
                                    <td>{campaign.templateName}</td>
                                    <td>{(campaign.sent + campaign.delivered + (campaign.read || 0) + (campaign.failed || 0)).toLocaleString()}</td>
                                    <td>{campaign.sent.toLocaleString()}</td>
                                    <td>{campaign.delivered.toLocaleString()}</td>
                                    <td>{(campaign.read || 0).toLocaleString()}</td>
                                    <td>{(campaign.failed || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* <header className="header">
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

            {/* <div className="stats-grid">
                <StatCard icon={Icons.Users} label="Total Users" value={usersData.length} changeType="positive" type="sent" />
                <StatCard icon={Icons.Check} label="MBU Completed" value={usersData.filter(u => u.mbuStatus === 'completed').length} changeType="positive" type="delivered" />
                <StatCard icon={Icons.Eye} label="In Progress" value={usersData.filter(u => u.mbuStatus === 'pending').length} changeType="positive" type="read" />
                <StatCard icon={Icons.XCircle} label="Pending" value={usersData.filter(u => u.mbuStatus === 'failed').length} changeType="negative" type="failed" />
            </div> */}

            <div className="content-grid" style={{ marginTop: '1.5rem' }}>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><Icons.BarChart /></div>
                            MBU Response
                        </div>
                    </div>
                    <div className="response-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    position={{ x: 210, y: 0 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="response-chart-center">
                            <div className="response-chart-value">{mbuTotal.toLocaleString()}</div>
                            <div className="response-chart-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '2px' }}>{mbuResponseRate}% Response</div>
                        </div>
                    </div>
                    <div className="mbu-grid">
                        <div className="mbu-card yes">
                            <div className="mbu-value">{animatedValues.mbuYes}</div>
                            <div className="mbu-label">MBU - Yes ({((data.campaign.mbuYes / mbuTotal) * 100).toFixed(1)}%)</div>
                        </div>
                        <div className="mbu-card no">
                            <div className="mbu-value">{animatedValues.mbuNo}</div>
                            <div className="mbu-label">MBU - No ({((data.campaign.mbuNo / mbuTotal) * 100).toFixed(1)}%)</div>
                        </div>
                        <div className="mbu-card not-now" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{animatedValues.notNow}</div>
                            <div className="mbu-label">Not Now ({((data.campaign.mbuNotNow / mbuTotal) * 100).toFixed(1)}%)</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><Icons.Bell /></div>
                            Reminders & Assets
                        </div>
                    </div>
                    <div className="response-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reminderChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {reminderChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    position={{ x: 210, y: 0 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="response-chart-center">
                            <div className="response-chart-value">{reminderDeliveryRate}%</div>
                            <div className="response-chart-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '2px' }}>Delivered</div>
                        </div>
                    </div>
                    <div className="mbu-grid">
                        <div className="mbu-card not-completed" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{animatedValues.remindersProgramYes.toLocaleString()}</div>
                            <div className="mbu-label">Reminders Opted - Yes</div>
                        </div>
                        <div className="mbu-card yes">
                            <div className="mbu-value">{animatedValues.remindersSent.toLocaleString()}</div>
                            <div className="mbu-label">Sent</div>
                        </div>
                        <div className="mbu-card no">
                            <div className="mbu-value">{(data.campaign.remindersSent - data.campaign.remindersDelivered).toLocaleString()}</div>
                            <div className="mbu-label">Failed</div>
                        </div>
                        <div className="mbu-card yes">
                            <div className="mbu-value">{animatedValues.remindersDelivered.toLocaleString()}</div>
                            <div className="mbu-label">Delivered</div>
                        </div>
                        <div className="mbu-card read">
                            <div className="mbu-value">{animatedValues.remindersRead.toLocaleString()}</div>
                            <div className="mbu-label">Read</div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
