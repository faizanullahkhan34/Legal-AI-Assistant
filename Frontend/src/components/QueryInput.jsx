import { useState, useEffect } from "react";
// import VoiceInput from "./VoiceInput";

export default function QueryInput({ onSend }) {
    const [text, setText] = useState("");
    const [city, setCity] = useState(localStorage.getItem("userCity") || "");

    useEffect(() => {
        if (!city) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        // Extract city: address.city || address.town || address.village || address.county
                        const detectedCity = data.address.city || data.address.town || data.address.village || data.address.county || "";

                        if (detectedCity) {
                            console.log("Detected City:", detectedCity);
                            setCity(detectedCity);
                            localStorage.setItem("userCity", detectedCity);
                        }
                    } catch (error) {
                        console.error("Error detecting location:", error);
                    }
                }, (error) => {
                    console.error("Geolocation permission denied or error:", error);
                });
            }
        }
    }, []);

    const handleSend = () => {
        if (!text.trim()) return;
        localStorage.setItem("userCity", city);
        onSend(text, city);
        setText("");
    };

    return (
        <div className="input-area">
            <div className="input-container">
                {/* <input
                    className="city-input"
                    placeholder="📍 City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    title="Detected city. Click to edit."
                /> */}
                <input
                    className="main-input"
                    placeholder="Ask your legal question..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="action-buttons">
                    <button className="send-btn" onClick={handleSend}>
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
