import { useState } from "react";
import LawyerList from "./LawyerList";

export default function ResponseTabs({ data }) {
    const [tab, setTab] = useState("answer");

    return (
        <div className="card">
            <div className="tabs">
                <button onClick={() => setTab("answer")}>📜 Answer</button>
                <button onClick={() => setTab("resolution")}>🛠 Resolution</button>
                <button onClick={() => setTab("lawyers")}>👨‍⚖️ Lawyers</button>
            </div>

            {tab === "answer" && <p>{data.answer}</p>}

            {tab === "resolution" && (
                <ul>
                    {data.possible_resolution?.steps?.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            )}

            {tab === "lawyers" && <LawyerList lawyers={data.nearby_lawyers} />}
        </div>
    );
}
