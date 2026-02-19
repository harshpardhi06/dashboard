import React, { useState, useEffect, useMemo } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StatCard } from '../components/StatCard'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getMBUResponseCounts, getScheduleStatusHistory } from '../users/scheduleApi'
import { getCampaignReport } from '../users/campaignApi'

export function DashboardPage({ data, userName }) {
    const [templateFilter, setTemplateFilter] = useState('All')
    const [languageFilter, setLanguageFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('')
    const [reminderDateFilter, setReminderDateFilter] = useState('')
    const [expandedDates, setExpandedDates] = useState(new Set())
    const [campaigns, setCampaigns] = useState([]);

    const [mbuCounts, setMBUCounts] = useState({
        yes: 0,
        no: 0,
        notNow: 0,
        noSelection: 0,
        failed: 0,
        total: 0,
    });

    const [reminderHistory, setReminderHistory] = useState([]);
    const [reminderStatusCounts, setReminderStatusCounts] = useState({
        sent: 0,
        delivered: 0,
        read: 0,
        failed: 0,
        total: 0,
        stat_date: "",
        langcode: "",
    });


    // Fetch schedule status history and format language codes for display
    const fetchScheduleStatusCount = async () => {
        try {
            const res = await getScheduleStatusHistory();

            if (res.success && Array.isArray(res.data)) {

                const formattedData = res.data.map(item => {
                    const lang = String(item.langcode ?? '')
                        .toLowerCase()
                        .trim();

                    let displayLang = item.langcode;

                    if (lang === 'hi' || lang === 'hindi') {
                        displayLang = 'Hindi';
                    } else if (lang === 'en' || lang === 'english') {
                        displayLang = 'English';
                    }

                    return {
                        ...item,
                        langcode: displayLang   // 🔥 yaha replace kar diya
                    };
                });

                setReminderHistory(formattedData);
            }
        } catch (err) {
            console.error('Error fetching schedule status history:', err);
        }
    };

    // Fetch MBU response counts and ensure numeric values with defaults
    const fetchMBUResponseCounts = async () => {
        try {
            const res = await getMBUResponseCounts()

            setMBUCounts({
                yes: Number(res.data.yes) || 0,
                no: Number(res.data.no) || 0,
                notNow: Number(res.data.not_now) || 0,
                noSelection: Number(res.data.no_selection) || 0,
                failed: Number(res.data.failed) || 0,
                total: Number(res.data.total) || 0,
            })
        } catch (error) {
            console.error('MBU API ERROR', error)
        }
    }

    // Fetch campaign report and map language codes to full names for display
    const fetchCampaignReport = async () => {
        try {
            const res = await getCampaignReport();
            console.log(res, "reportsdata")

            // Map language codes to full names
            const mappedRes = (res || []).map(c => {
                const lang = String(c.langcode || '').toLowerCase().trim();
                let displayLang = c.langcode;

                if (lang === 'hi' || lang === 'hindi') {
                    displayLang = 'Hindi';
                } else if (lang === 'en' || lang === 'english') {
                    displayLang = 'English';
                }

                return {
                    ...c,
                    langcode: displayLang
                };
            });

            setCampaigns(mappedRes);
        } catch (error) {
            console.error('Campaign Report API ERROR', error);
        }
    };



    useEffect(() => {
        fetchMBUResponseCounts();
        fetchCampaignReport();
        fetchScheduleStatusCount();


        const interval = setInterval(() => {
            fetchScheduleStatusCount();
            fetchMBUResponseCounts();
        }, 5000); // 5 sec

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

// Apply filters to campaigns and sort by date
    const filteredCampaigns = campaigns
        .filter(c => (templateFilter === 'All' || c.template_type === templateFilter))
        .filter(c => (languageFilter === 'All' || c.langcode === languageFilter))
        .filter(c => {
            if (!dateFilter) return true
            const cDate = c.entrytime ? new Date(c.entrytime).toISOString().slice(0, 10) : ''
            return cDate === dateFilter
        })
        .sort((a, b) => new Date(b.entrytime || 0) - new Date(a.entrytime || 0))

    const campaignStats = useMemo(() => {
        return campaigns.reduce((acc, campaign) => {
            const templateType = String(campaign.template_type || '').toLowerCase();
            const isFormal = templateType === 'formal';
            const isInformal = templateType === 'informal';

            // Sent
            const sent = Number(campaign.sent) || 0;
            acc.sent += sent;
            if (isFormal) acc.sentFormal += sent;
            if (isInformal) acc.sentInformal += sent;

            // Delivered
            const delivered = Number(campaign.delivered) || 0;
            acc.delivered += delivered;
            if (isFormal) acc.deliveredFormal += delivered;
            if (isInformal) acc.deliveredInformal += delivered;

            // Read (mapped from dbtick)
            const read = Number(campaign.dbtick) || 0;
            acc.read += read;
            if (isFormal) acc.readFormal += read;
            if (isInformal) acc.readInformal += read;

            // Failed
            const failed = Number(campaign.failed) || 0;
            acc.failed += failed;
            if (isFormal) acc.failedFormal += failed;
            if (isInformal) acc.failedInformal += failed;

            return acc;
        }, {
            sent: 0, sentFormal: 0, sentInformal: 0,
            delivered: 0, deliveredFormal: 0, deliveredInformal: 0,
            read: 0, readFormal: 0, readInformal: 0,
            failed: 0, failedFormal: 0, failedInformal: 0
        });
    }, [campaigns]);

    const mbuTotal = mbuCounts.yes + mbuCounts.no + mbuCounts.notNow + mbuCounts.noSelection

    const chartData = useMemo(() => [
        { name: 'MBU Yes', value: mbuCounts.yes, color: '#10b981' },
        { name: 'MBU No', value: mbuCounts.no, color: '#c6cd49' },
        { name: 'Not Now', value: mbuCounts.notNow, color: '#f59e0b' },
        { name: 'No Selection', value: mbuCounts.noSelection, color: '#94a3b8' },
    ], [mbuCounts])

    const mbuResponded =
        (mbuCounts?.yes || 0) +
        (mbuCounts?.no || 0) +
        (mbuCounts?.notNow || 0)

    const mbuResponseRate = mbuTotal
        ? ((mbuResponded / mbuTotal) * 100).toFixed(1)
        : 0

// Calculate aggregated reminder stats based on the selected date filter
    const activeReminderStats = useMemo(() => {
        const targetDate = reminderDateFilter || new Date().toISOString().split('T')[0];
        const relevantRecords = reminderHistory.filter(item => item.stat_date === targetDate);

        const aggregated = relevantRecords.reduce((acc, curr) => {
            acc.sent += (Number(curr.sent) || 0);
            acc.delivered += (Number(curr.delivered) || 0);
            acc.read += (Number(curr.read) || 0);
            acc.failed += (Number(curr.failed) || 0);
            acc.total += (Number(curr.total_count) || 0);
            acc.recordCount += 1;
            return acc;
        }, { sent: 0, delivered: 0, read: 0, failed: 0, total: 0, recordCount: 0 });

        return { ...aggregated, date: targetDate };
    }, [reminderHistory, reminderDateFilter]);

    const reminderChartData = useMemo(() => [
        { name: 'Sent', value: activeReminderStats.sent, color: '#3bb80a' },
        { name: 'Delivered', value: activeReminderStats.delivered, color: '#6366f1' },
        { name: 'Read', value: activeReminderStats.read, color: '#0ea5e9' },
        { name: 'Failed', value: activeReminderStats.failed, color: '#f43f5e' },
    ], [activeReminderStats])

    const totalScheduled = activeReminderStats.total || 0

    const deliveryRate = totalScheduled
        ? ((activeReminderStats.delivered / totalScheduled) * 100).toFixed(1)
        : 0


    const CustomTooltip = ({ active, payload, total }) => {
        if (active && payload && payload.length) {
            const percentage = total ? ((payload[0].value / total) * 100).toFixed(1) : null
            return (
                <div className="custom-tooltip" style={{
                    background: 'white',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{payload[0].name}</p>
                    <p style={{ margin: 0, color: payload[0].payload.color, fontWeight: 700 }}>
                        {payload[0].value.toLocaleString()} {percentage ? `(${percentage}%)` : ''}
                    </p>
                </div>
            )
        }
        return null
    }

    const filteredReminders = reminderHistory
        .filter(reminder => {
            if (reminderDateFilter && reminder.stat_date !== reminderDateFilter) return false
            // Note: API data might not have language and templateName in the same way, 
            // but we can filter by templateid if needed. For now, following the user's request for status values.
            return true
        })
        .sort((a, b) => new Date(b.stat_date) - new Date(a.stat_date))

    // Group reminders by date
    const groupedReminders = filteredReminders.reduce((acc, reminder) => {
        const date = reminder.stat_date;
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(reminder)
        return acc
    }, {})

    // Calculate aggregated totals for each date
    const dateAggregates = Object.entries(groupedReminders).map(([date, reminders]) => {
        const total = reminders.reduce((sum, r) => sum + (Number(r.total_count) || 0), 0)
        const sent = reminders.reduce((sum, r) => sum + (Number(r.sent) || 0), 0)
        const delivered = reminders.reduce((sum, r) => sum + (Number(r.delivered) || 0), 0)
        const read = reminders.reduce((sum, r) => sum + (Number(r.read) || 0), 0)
        const failed = reminders.reduce((sum, r) => sum + (Number(r.failed) || 0), 0)
        return { date, total, sent, delivered, read, failed, details: reminders }
    }).sort((a, b) => new Date(b.date) - new Date(a.date))

    const toggleDateExpansion = (date) => {
        setExpandedDates(prev => {
            const newSet = new Set(prev)
            if (newSet.has(date)) {
                newSet.delete(date)
            } else {
                newSet.add(date)
            }
            return newSet
        })
    }

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Welcome, {userName}</h2>
                    <h1 style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 'normal', marginTop: '0' }}>Campaign Overview</h1>
                    <p>WhatsApp Aadhar MBU Campaign Analytics</p>
                </div>
                <div className="header-right">
                    <div className="header-date">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard
                    icon={SendIcon}
                    label="Sent Messages"
                    value={campaignStats.sent}
                    formalValue={campaignStats.sentFormal}
                    informalValue={campaignStats.sentInformal}
                    changeType="positive"
                    type="sent"
                />
                <StatCard
                    icon={CheckIcon}
                    label="Delivered Messages"
                    value={campaignStats.delivered}
                    formalValue={campaignStats.deliveredFormal}
                    informalValue={campaignStats.deliveredInformal}
                    changeType="positive"
                    type="delivered"
                />
                <StatCard
                    icon={VisibilityIcon}
                    label="Read Messages"
                    value={campaignStats.read}
                    formalValue={campaignStats.readFormal}
                    informalValue={campaignStats.readInformal}
                    changeType="positive"
                    type="read"
                />
                <StatCard
                    icon={CancelIcon}
                    label="Failed Messages"
                    value={campaignStats.failed}
                    formalValue={campaignStats.failedFormal}
                    informalValue={campaignStats.failedInformal}
                    changeType="negative"
                    type="failed"
                />
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header">
                    <div className="card-title">
                        <div className="card-title-icon"><DescriptionIcon /></div>
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
                                <CancelIcon sx={{ fontSize: 16 }} />
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
                                <th>Sent</th>
                                <th>Delivered</th>
                                <th>Read</th>
                                <th>Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>
                                        No campaigns found
                                    </td>
                                </tr>
                            ) : (
                                filteredCampaigns.map(campaign => (
                                    <tr key={campaign.campaignid}>
                                        <td className="date-cell">{campaign.entrytime ? new Date(campaign.entrytime).toLocaleDateString() : '-'}</td>
                                        <td style={{ fontWeight: 500 }}>{campaign.campaign_title || '-'}</td>
                                        <td>{campaign.langcode || '-'}</td>
                                        <td>{campaign.template_type || '-'}</td>
                                        <td>{(campaign.sent || 0).toLocaleString()}</td>
                                        <td>{(campaign.delivered || 0).toLocaleString()}</td>
                                        <td>{(campaign.dbtick || 0).toLocaleString()}</td>
                                        <td>{(campaign.failed || 0).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="content-grid" style={{ marginTop: '1.5rem' }}>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><BarChartIcon /></div>
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
                                    isAnimationActive={false}
                                    animationDuration={0}
                                    animationBegin={0}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip total={mbuTotal} />} position={{ x: 210, y: 0 }} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="response-chart-center">
                            <div className="response-chart-value">
                                {mbuResponded.toLocaleString()}
                            </div>
                            <div
                                className="response-chart-label"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-blue)',
                                    marginTop: '2px',
                                }}
                            >
                                {mbuResponseRate}% Response
                            </div>
                        </div>
                    </div>

                    <div className="mbu-grid">
                        <div className="mbu-card yes">
                            <div className="mbu-value">{mbuCounts.yes.toLocaleString()}</div>
                            <div className="mbu-label">MBU - Yes ({mbuTotal ? ((mbuCounts.yes / mbuTotal) * 100).toFixed(1) : 0}%)</div>
                        </div>
                        <div className="mbu-card no">
                            <div className="mbu-value">{mbuCounts.no.toLocaleString()}</div>
                            <div className="mbu-label">MBU - No ({mbuTotal ? ((mbuCounts.no / mbuTotal) * 100).toFixed(1) : 0}%)</div>
                        </div>
                        <div className="mbu-card not-now">
                            <div className="mbu-value">{mbuCounts.notNow.toLocaleString()}</div>
                            <div className="mbu-label">Not Now ({mbuTotal ? ((mbuCounts.notNow / mbuTotal) * 100).toFixed(1) : 0}%)</div>
                        </div>
                        <div className="mbu-card failed-response">
                            <div className="mbu-value">{(campaignStats.failed || 0).toLocaleString()}</div>
                            <div className="mbu-label">Failed ({mbuTotal ? ((campaignStats.failed / mbuTotal) * 100).toFixed(1) : 0}%)</div>
                        </div>
                        <div className="mbu-card no-selection" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{mbuCounts.noSelection.toLocaleString()}</div>
                            <div className="mbu-label">No Selection ({mbuTotal ? ((mbuCounts.noSelection / mbuTotal) * 100).toFixed(1) : 0}%)</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><NotificationsIcon /></div>
                            {reminderDateFilter ? 'Filtered Reminders' : "Today's Reminders"}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                                {new Date(activeReminderStats.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
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
                                    isAnimationActive={false}
                                    animationDuration={0}
                                    animationBegin={0}
                                >
                                    {reminderChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip total={totalScheduled} />} position={{ x: 210, y: 0 }} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="response-chart-center">
                            <div className="response-chart-value">
                                {activeReminderStats.delivered.toLocaleString()}
                            </div>
                            <div
                                className="response-chart-label"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-blue)',
                                    marginTop: '2px',
                                }}
                            >
                                {deliveryRate}% Delivered
                            </div>
                        </div>
                    </div>

                    <div className="mbu-grid">
                        <div className="mbu-card not-completed" style={{ gridColumn: 'span 2' }}>
                            <div className="mbu-value">{totalScheduled.toLocaleString()}</div>
                            <div className="mbu-label">
                                Total Schedule - Yes (100%)
                            </div>
                        </div>

                        <div className="mbu-card yes">
                            <div className="mbu-value">
                                {activeReminderStats.sent.toLocaleString()}
                                <span style={{ fontSize: '0.9rem', marginLeft: '4px', opacity: 0.8 }}>
                                    ({totalScheduled ? ((activeReminderStats.sent / totalScheduled) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                            <div className="mbu-label">Sent</div>
                        </div>

                        <div className="mbu-card no">
                            <div className="mbu-value">
                                {activeReminderStats.failed.toLocaleString()}
                                <span style={{ fontSize: '0.9rem', marginLeft: '4px', opacity: 0.8 }}>
                                    ({totalScheduled ? ((activeReminderStats.failed / totalScheduled) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                            <div className="mbu-label">Failed</div>
                        </div>

                        <div className="mbu-card yes">
                            <div className="mbu-value">
                                {activeReminderStats.delivered.toLocaleString()}
                                <span style={{ fontSize: '0.9rem', marginLeft: '4px', opacity: 0.8 }}>
                                    ({totalScheduled ? ((activeReminderStats.delivered / totalScheduled) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                            <div className="mbu-label">Delivered</div>
                        </div>

                        <div className="mbu-card read">
                            <div className="mbu-value">
                                {activeReminderStats.read.toLocaleString()}
                                <span style={{ fontSize: '0.9rem', marginLeft: '4px', opacity: 0.8 }}>
                                    ({totalScheduled ? ((activeReminderStats.read / totalScheduled) * 100).toFixed(1) : 0}%)
                                </span>
                            </div>
                            <div className="mbu-label">Read</div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header">
                    <div className="card-title">
                        <div className="card-title-icon"><NotificationsIcon /></div>
                        Reminders History
                    </div>
                    <div className="table-actions">
                        <input
                            type="date"
                            className="filter-select"
                            value={reminderDateFilter}
                            onChange={(e) => setReminderDateFilter(e.target.value)}
                        />
                        {/* Date filter only for now since API doesn't provide language/template filtering yet */}
                        {reminderDateFilter && (
                            <button
                                className="icon-btn"
                                onClick={() => setReminderDateFilter('')}
                                title="Clear date filter"
                                style={{ height: '38px', padding: '0 10px' }}
                            >
                                <CancelIcon sx={{ fontSize: 16 }} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="table-container reminders-table-container">
                    <table className="campaign-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Template</th>
                                <th>Language</th>
                                <th>Total Scheduled</th>
                                <th>Sent</th>
                                <th >Delivered</th>
                                <th>Read</th>
                                <th>Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dateAggregates.map(dateGroup => {
                                const isExpanded = expandedDates.has(dateGroup.date)
                                return (
                                    <React.Fragment key={dateGroup.date}>
                                        <tr
                                            className="date-group-row"
                                            onClick={() => toggleDateExpansion(dateGroup.date)}
                                            style={{ cursor: 'pointer', backgroundColor: '#f8fafc', fontWeight: 600 }}
                                        >
                                            <td className="date-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                                                {dateGroup.date}
                                            </td>
                                            <td style={{ color: '#64748b' }}>All Templates</td>
                                            <td style={{ color: '#64748b' }}>All Languages</td>
                                            <td>{dateGroup.total.toLocaleString()}</td>
                                            <td>{dateGroup.sent.toLocaleString()}</td>
                                            <td>{dateGroup.delivered.toLocaleString()}</td>
                                            <td>{dateGroup.read.toLocaleString()}</td>
                                            <td>{dateGroup.failed.toLocaleString()}</td>
                                        </tr>
                                        {isExpanded && dateGroup.details.map(reminder => (
                                            <tr key={reminder.id} className="detail-row" style={{ backgroundColor: '#dcdee0' }}>
                                                <td style={{ paddingLeft: '40px' }}></td>
                                                <td style={{ fontWeight: 500 }}>{reminder.templateid}</td>
                                                <td>{reminder.langcode}</td>
                                                <td>{(reminder.total_count || 0).toLocaleString()}</td>
                                                <td>{(reminder.sent || 0).toLocaleString()}</td>
                                                <td>{(reminder.delivered || 0).toLocaleString()}</td>
                                                <td>{(reminder.read || 0).toLocaleString()}</td>
                                                <td>{(reminder.failed || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}


