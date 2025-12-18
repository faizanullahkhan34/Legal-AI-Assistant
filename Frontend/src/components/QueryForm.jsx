import { useState } from "react";
import { askLegalBot } from "../api/legalApi";
import VoiceInput from "./VoiceInput";

export default function QueryForm({ onResponse }) {
    const [query, setQuery] = useState("");
    const [language, setLanguage] = useState("auto");
    const [location, setLocation] = useState("");

    const submit = async () => {
        const data = await askLegalBot(query, language, location);
        onResponse(data);
    };

    return (
        <div className="card">
            <textarea
                placeholder="Describe your legal issue (Hindi or English)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <div className="row">
                <select onChange={(e) => setLanguage(e.target.value)}>
                    <option value="auto">Auto</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>

                <input
                    placeholder="Your city"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* <VoiceInput onText={(text) => setQuery(text)} /> */}

            <button className="primary-btn" onClick={submit}>
                Get Legal Guidance →
            </button>

        </div>
    );
}
