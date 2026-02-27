import React, { useEffect, useState } from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { uploadCampaignCSV } from '../users/campaignApi'
import { downloadCSVReport, getCampaignId } from '../users/reportsApi'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export function ReportsPage() {
    const [campaignId, setCampaignId] = useState('')
    const [exportCampaignId, setExportCampaignId] = useState('')
    const [campaigns, setCampaigns] = useState([])

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    })

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity })
        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, open: false }))
        }, 3000)
    }

    // FETCH CAMPAIGN LIST
    useEffect(() => {
        fetchCampaignsId()
    }, [])

    const fetchCampaignsId = async () => {
        try {
            const res = await getCampaignId()
            const data = Array.isArray(res) ? res : res?.data || []

            const seen = new Set()
            const formatted = []

            data.forEach(item => {
                const id = item.campaign_id || item.campaignid || item.campaignId
                if (id && !seen.has(id)) {
                    seen.add(id)
                    formatted.push({
                        campaignid: id,
                        campaign_title:
                            item.campaign_title ||
                            item.campaignName ||
                            ''
                    })
                }
            })

            setCampaigns(formatted)
        } catch (error) {
            console.error("Error fetching campaigns:", error)
            showSnackbar("Failed to load campaign list", "error")
        }
    }

    // EXPORT CSV
    const handleExport = async () => {
        try {
            if (!exportCampaignId) {
                showSnackbar("Please select a Campaign ID", "warning")
                return
            }

            const response = await downloadCSVReport(exportCampaignId)

            const blob = new Blob([response.data], { type: "text/csv" })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `campaign_${exportCampaignId}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            showSnackbar("Report exported successfully", "success")

        } catch (error) {
            console.error("Export Error:", error)
            showSnackbar("Failed to export report", "error")
        }
    }

    // UPLOAD CSV
    const handleCampaignUpload = async (e) => {
        const file = e.target.files[0]

        if (!campaignId.trim()) {
            showSnackbar('Please enter Campaign ID', 'error')
            e.target.value = ''
            return
        }

        if (!file) return

        if (!file.name.toLowerCase().endsWith('.csv')) {
            showSnackbar('Only CSV files are allowed.', 'error')
            e.target.value = ''
            return
        }

        try {
            const trimmedId = campaignId.trim()

            const formData = new FormData()
            formData.append('file', file)
            formData.append('campaignid', trimmedId)

            const res = await uploadCampaignCSV(formData)

            showSnackbar(
                `CSV uploaded successfully. ${res?.totalInserted || 0} records inserted.`,
                'success'
            )

            //  ADD NEW CAMPAIGN TO DROPDOWN
            setCampaigns(prev => {
                const exists = prev.some(c => c.campaignid === trimmedId)
                if (exists) return prev

                return [
                    ...prev,
                    {
                        campaignid: trimmedId,
                        campaign_title: ''
                    }
                ]
            })

            // Auto select in export dropdown
            setExportCampaignId(trimmedId)

            // Clear input
            e.target.value = ''

        } catch (error) {
            console.error("Upload Error:", error)
            showSnackbar('Failed to upload CSV.', 'error')
            e.target.value = ''
        }
    }

    return (
        <div className="main-content" style={{ marginLeft: 0, padding: '1.5rem 2rem' }}>
            <header className="header">
                <div className="header-left">
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Reports</h1>
                    <p style={{ fontSize: '0.875rem' }}>Campaign Management & Exports</p>
                </div>
                <div className="header-right">
                    <div className="header-date">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </header>

            <div
                className="content-grid"
                style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    marginTop: '2rem'
                }}
            >

                {/* Upload Section */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><FileUploadIcon /></div>
                            Upload CSV
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Enter Campaign ID</label>
                            <input
                                type="text"
                                className="filter-select"
                                style={{ width: '100%', height: '42px', padding: '0 12px' }}
                                placeholder="e.g. campaign_123"
                                value={campaignId}
                                onChange={(e) => setCampaignId(e.target.value.trimStart())}
                            />
                        </div>

                        <label
                            className="header-btn"
                            style={{
                                width: '100%',
                                padding: '12px',
                                justifyContent: 'center',
                                cursor: campaignId.trim() ? 'pointer' : 'not-allowed',
                                opacity: campaignId.trim() ? 1 : 0.6,
                                backgroundColor: 'var(--bg-secondary)',
                                border: '2px dashed var(--border-color)'
                            }}
                        >
                            <FileUploadIcon sx={{ fontSize: 20, marginRight: '8px' }} />
                            <span>Click to Upload CSV</span>

                            <input
                                type="file"
                                accept=".csv"
                                style={{ display: 'none' }}
                                onChange={handleCampaignUpload}
                                disabled={!campaignId.trim()}
                            />
                        </label>
                    </div>
                </div>

                {/* Export Section */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon"><FileDownloadIcon /></div>
                            Export Users Data
                        </div>
                    </div>

                    <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <FormControl fullWidth size="small" sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                            },
                        }}>
                            <InputLabel id="campaign-select-label">
                                Select Campaign
                            </InputLabel>

                            <Select
                                labelId="campaign-select-label"
                                id="campaign-select"
                                value={exportCampaignId}
                                label="Select Campaign"
                                onChange={(e) => setExportCampaignId(e.target.value)}
                            >
                                <MenuItem value="">
                                    Select a Campaign
                                </MenuItem>

                                {campaigns.map((c) => (
                                    <MenuItem
                                        key={c.campaignid}
                                        value={c.campaignid}
                                    >
                                        {c.campaignid}
                                        {c.campaign_title
                                            ? ` - ${c.campaign_title}`
                                            : ""}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <button
                            className="header-btn"
                            onClick={handleExport}
                            disabled={!exportCampaignId}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                height: '42px',
                                opacity: exportCampaignId ? 1 : 0.6,
                                cursor: exportCampaignId ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <FileDownloadIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Snackbar */}
            <div className={`snackbar ${snackbar.open ? 'show' : ''} ${snackbar.severity}`}>
                {snackbar.message}
            </div>
        </div>
    )
}
