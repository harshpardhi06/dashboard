import { Icons } from './Icons'

export function StatCard({ icon: Icon, label, value, change, changeType, type }) {
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
