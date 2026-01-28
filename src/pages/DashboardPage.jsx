import { useState } from 'react'
import { Icons } from '../components/Icons'
import { StatCard } from '../components/StatCard'
import { FlowNode } from '../components/FlowNode'
import { CircularProgress } from '../components/CircularProgress'
import { usersData } from '../data/mockData'

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
                            title="Filter by Date"
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
                                title="Clear date selection"
                                style={{ height: '38px', padding: '0 10px' }}
                            >
                                <Icons.XCircle size={14} />
                            </button>
                        )}
                    </div>
                </div>
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
                                {/* <td style={{ fontWeight: 600, color: 'var(--accent-green)' }}>
                                    {campaign.response || Math.round(((campaign.read || 0) / (campaign.delivered || 1)) * 100) + '%'}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                        {/* <CircularProgress percentage={Math.round((data.campaign.mbuYes / data.campaign.flowCompleted) * 100)} /> */}
                        <div className="response-chart-center">
                            <div className="response-chart-value">{Math.round(data.campaign.mbuYes + data.campaign.mbuNo + data.campaign.mbuNotNow)} </div>
                            <div className="response-chart-label">Total MBU Responses</div>
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
                        <div className="mbu-card not-now" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{animatedValues.notNow}</div>
                            <div className="mbu-label">Not Now</div>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="legend">
                            {/* <div className="legend-item">
                                <div className="legend-color mbu-yes"></div>
                                <span className="legend-text">MBU Accepted</span>
                                <span className="legend-value">{animatedValues.mbuYes}</span>
                            </div> */}
                            {/* <div className="legend-item">
                                <div className="legend-color mbu-no"></div>
                                <span className="legend-text">MBU Rejected</span>
                                <span className="legend-value">{animatedValues.mbuNo}</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color not-complete"></div>
                                <span className="legend-text">Incomplete</span>
                                <span className="legend-value">{animatedValues.notCompleted}</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-grid" style={{ marginTop: '1.5rem' }}>
                {/* Communication Breakdown */}
                {/* <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><Icons.Globe /></div>
                            Communication Breakdown
                        </div>
                    </div>
                    <div className="breakdown-grid">
                        <div className="breakdown-section">
                            <h4 className="section-subtitle">Language Wise</h4>
                            <div className="legend-item">
                                <span className="legend-text">English</span>
                                <span className="legend-value">{animatedValues.eng.toLocaleString()}</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-text">Hindi</span>
                                <span className="legend-value">{animatedValues.hin.toLocaleString()}</span>
                            </div>

                        </div>
                        <div className="breakdown-section">
                            <h4 className="section-subtitle">By Date & Format</h4>
                            <div className="format-group">
                                <div className="legend-item">
                                    <span className="legend-text">Formal Delivery</span>
                                    <span className="legend-value">{animatedValues.formalTotal.toLocaleString()}</span>
                                </div>
                                <div className="format-sub-items">
                                    <div className="sub-item">
                                        <div className="branch-dot" style={{ width: 6, height: 6, background: 'var(--accent-blue)' }}></div>
                                        <span className="sub-text">English</span>
                                        <span className="sub-value">{animatedValues.formalEng.toLocaleString()}</span>
                                    </div>
                                    <div className="sub-item">
                                        <div className="branch-dot" style={{ width: 6, height: 6, background: 'var(--accent-blue)' }}></div>
                                        <span className="sub-text">Hindi</span>
                                        <span className="sub-value">{animatedValues.formalHin.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="format-group">
                                <div className="legend-item">
                                    <span className="legend-text">Informal Delivery</span>
                                    <span className="legend-value">{animatedValues.informalTotal.toLocaleString()}</span>
                                </div>
                                <div className="format-sub-items">
                                    <div className="sub-item">
                                        <div className="branch-dot" style={{ width: 6, height: 6, background: 'var(--accent-indigo)' }}></div>
                                        <span className="sub-text">English</span>
                                        <span className="sub-value">{animatedValues.informalEng.toLocaleString()}</span>
                                    </div>
                                    <div className="sub-item">
                                        <div className="branch-dot" style={{ width: 6, height: 6, background: 'var(--accent-indigo)' }}></div>
                                        <span className="sub-text">Hindi</span>
                                        <span className="sub-value">{animatedValues.informalHin.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Reminders & Assets */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><Icons.Bell /></div>
                            Reminders & Assets
                        </div>
                    </div>
                    <div className="mbu-grid">
                        <div className="mbu-card not-completed" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{animatedValues.remindersProgramYes.toLocaleString()}</div>
                            <div className="mbu-label">Reminders Opted - Yes</div>
                        </div>
                        <div className="mbu-card yes">
                            <div className="mbu-value">{animatedValues.remindersSent.toLocaleString()}</div>
                            <div className="mbu-label">Reminders Sent</div>
                        </div>
                        <div className="mbu-card no">
                            <div className="mbu-value">{animatedValues.remindersPushed.toLocaleString()}</div>
                            <div className="mbu-label">Reminders failed</div>
                        </div>
                        <div className="mbu-card yes">
                            <div className="mbu-value">{animatedValues.remindersDelivered.toLocaleString()}</div>
                            <div className="mbu-label">Reminders Delivered</div>
                        </div>
                        <div className="mbu-card read">
                            <div className="mbu-value">{animatedValues.remindersRead.toLocaleString()}</div>
                            <div className="mbu-label">Reminders Read</div>
                        </div>
                    </div>
                    {/* <div className="sidebar-section" style={{ marginTop: '1.5rem' }}>
                        <h4 className="section-subtitle">Asset Delivery</h4>
                        <div className="legend">
                            <div className="legend-item">
                                <div className="legend-color mbu-yes"></div>
                                <span className="legend-text">Video Pushed</span>
                                <span className="legend-value">{animatedValues.video.toLocaleString()}</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color mbu-no"></div>
                                <span className="legend-text">Poster Pushed</span>
                                <span className="legend-value">{animatedValues.poster.toLocaleString()}</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>


        </>
    )
}
