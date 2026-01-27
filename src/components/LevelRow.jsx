export function LevelRow({ level, branch, type }) {
    return (
        <div className="level-row">
            <div className="level-badge">L{level}</div>
            <div className="level-info">
                <div className="level-branch">{branch}</div>
                <span className={`level-type-badge ${type}`}>{type}</span>
            </div>
        </div>
    )
}
