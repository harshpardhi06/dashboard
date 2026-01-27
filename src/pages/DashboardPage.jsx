import { Icons } from '../components/Icons'
import { StatCard } from '../components/StatCard'
import { FlowNode } from '../components/FlowNode'
import { CircularProgress } from '../components/CircularProgress'
import { usersData } from '../data/mockData'

export function DashboardPage({ data, animatedValues }) {
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
