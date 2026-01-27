export function FlowNode({ icon: Icon, iconType, label, value }) {
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
