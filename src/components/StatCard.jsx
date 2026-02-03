import { Icons } from './Icons'

export function StatCard({ icon: Icon, label, value, change, changeType, type, formalValue, informalValue }) {
    return (
        <div className={`stat-card ${type}`}>
            <div className="stat-card-header">
                <div className="stat-card-icon"><Icon /></div>
                <span className="stat-card-label">{label}</span>
            </div>
            <div className="stat-card-value">{value.toLocaleString()}</div>
            {(formalValue !== undefined || informalValue !== undefined) && (
                <div className="stat-card-breakdown">
                    <div className="breakdown-item">
                        <span className="dot formal"></span>
                        <span className="label">Formal:</span>
                        <span className="value">{formalValue?.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                        <span className="dot informal"></span>
                        <span className="label">Informal:</span>
                        <span className="value">{informalValue?.toLocaleString()}</span>
                    </div>
                </div>
            )}
            {change && (
                <div className={`stat-card-change ${changeType}`}>
                    {changeType === 'positive' ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
                    <span>{change}</span>
                </div>
            )}
        </div>
    )
}
