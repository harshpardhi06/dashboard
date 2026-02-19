import React, { useState } from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { getCampaignReport, uploadCampaignCSV } from '../users/campaignApi'
import { downloadCSVReport } from '../users/reportsApi'

export function ReportsPage() {
    const [campaignId, setCampaignId] = useState('')
    const [exportCampaignId, setExportCampaignId] = useState('')

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info' // success | error | warning | info
    })

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity })

        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, open: false }))
        }, 3000)
    }

    // ================= EXPORT =================
    // const handleExport = async () => {
    //     // if (!campaignId.trim()) {
    //     //     showSnackbar('Please enter a Campaign ID', 'error')
    //     //     return
    //     // }

    //     try {
    //         const res = await getCampaignReport()

    //         const campaign = (res || []).find(
    //             c => String(c.campaignid) === String(exportCampaignId)
    //         )

    //         if (!campaign) {
    //             showSnackbar(
    //                 `Campaign ID ${campaignId} not found in reports.`,
    //                 'error'
    //             )
    //             return
    //         }

    //         const headers = Object.keys(campaign)
    //         const values = Object.values(campaign)

    //         const csvContent =
    //             "data:text/csv;charset=utf-8," +
    //             headers.join(",") +
    //             "\n" +
    //             values.map(v => `"${v ?? ''}"`).join(",")

    //         const encodedUri = encodeURI(csvContent)
    //         const link = document.createElement("a")
    //         link.setAttribute("href", encodedUri)
    //         link.setAttribute(
    //             "download",
    //             `campaign_${exportCampaignId}_data.csv`
    //         )

    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)

    //         showSnackbar(
    //             `Campaign ${exportCampaignId} exported successfully`,
    //             'success'
    //         )
    //     } catch (error) {
    //         console.error('Export Error:', error)
    //         showSnackbar('Failed to export campaign data.', 'error')
    //     }
    // }

    const handleExport = async () => {
        debugger;
        try {

            if (!exportCampaignId) {
                showSnackbar("Please enter Campaign ID", "warning");
                return;
            }

            const response = await downloadCSVReport(exportCampaignId);

            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `campaign_${exportCampaignId}.csv`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            showSnackbar("Report exported successfully", "success");

        } catch (error) {
            console.error("Export Error:", error);
            showSnackbar("Failed to export report.", "error");
        }
    };

    // ================= UPLOAD =================

    const handleCampaignUpload = async (e) => {
        debugger;
        const file = e.target.files[0]

        if (!campaignId.trim()) {
            showSnackbar('Please enter Campaign ID before uploading.', 'error')
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
            const formData = new FormData()
            formData.append('file', file)
            formData.append('campaignid', campaignId.trim())

            const res = await uploadCampaignCSV(formData)

            showSnackbar(
                `CSV uploaded successfully. ${res?.totalInserted || 0} records inserted.`,
                'success'
            )

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
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        Reports
                    </h1>
                    <p style={{ fontSize: '0.875rem' }}>
                        Campaign Management & Exports
                    </p>
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
                {/* ================= Upload Section ================= */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon">
                                <FileUploadIcon />
                            </div>
                            Upload CSV
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Enter Campaign ID</label>
                        <input
                            type="text"
                            placeholder="e.g. 12345"
                            className="filter-select"
                            style={{ width: '100%', height: '42px' }}
                            value={campaignId}
                            onChange={(e) => setCampaignId(e.target.value)}
                        />
                    </div>

                    <div style={{ padding: '1rem 0' }}>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Select a CSV file to upload a new campaign.
                        </p>

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

                {/* ================= Export Section ================= */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <div className="card-title-icon">
                                <FileDownloadIcon />
                            </div>
                            Export Campaign Data
                        </div>
                    </div>

                    <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <label>Enter Campaign ID</label>
                        <input
                            type="text"
                            placeholder="e.g. 12345"
                            className="filter-select"
                            style={{ width: '100%', height: '42px' }}
                            value={exportCampaignId}
                            onChange={(e) => setExportCampaignId(e.target.value)}
                        />

                        <button
                            className="header-btn"
                            onClick={handleExport}
                            disabled={!exportCampaignId.trim()}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                height: '42px',
                                opacity: exportCampaignId.trim() ? 1 : 0.6,
                                cursor: exportCampaignId.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <FileDownloadIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= Snackbar ================= */}
            <div
                className={`snackbar ${snackbar.open ? 'show' : ''} ${snackbar.severity}`}
            >
                {snackbar.message}
            </div>
        </div>
    )
}
