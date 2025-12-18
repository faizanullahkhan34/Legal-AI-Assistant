export default function LawyerList({ lawyers = [] }) {
    if (!lawyers.length) return null;

    return (
        <div className="lawyer-list">
            <h4>👨‍⚖️ Suggested Lawyers nearby</h4>
            <ul>
                {lawyers.map((l, i) => (
                    <li key={i}>
                        <strong>{l.name}</strong>
                        <br />
                        <span style={{ fontSize: "0.9em", color: "#555" }}>
                            📞 {l.contact}
                        </span>
                        {l.link !== "#" && (
                            <a
                                href={l.link}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "block", fontSize: "0.85em", marginTop: "4px" }}
                            >
                                View Profile ↗
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
