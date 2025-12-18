import { useState, useEffect } from "react";
import GuidedForm from "./components/GuidedForm";
import ChatWindow from "./components/ChatWindow";
import QueryInput from "./components/QueryInput";
import Disclaimer from "./components/Disclaimer";
import ThemeToggle from "./components/ThemeToggle";
import { askLegalBot } from "./api/legalApi";

export default function App() {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "bot",
            answer: "Namaste! I am your Indian Legal Assistant. To get started, may I know your name?",
            time: new Date().toLocaleTimeString()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(false); // Initially false, wait for name
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null);

    // ... theme logic ...
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        // 🔥 THIS LINE MAKES DARK MODE WORK
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const handleNameSubmit = () => {
        if (!inputValue.trim()) return;
        const name = inputValue.trim();
        setUserName(name);
        localStorage.setItem("userName", name);

        // Add User Name Message
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: "user",
            text: `My name is ${name}`,
            time: new Date().toLocaleTimeString()
        }]);

        // Bot Greeting
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: "bot",
                answer: `Hello ${name}! How can I help you with the Constitution of India today?`,
                time: new Date().toLocaleTimeString()
            }]);
            setShowGuide(true); // Show guided form now
        }, 800);
    };

    const sendMessage = async (text, location) => {
        const userMsg = {
            id: crypto.randomUUID(),
            role: "user",
            text,
            time: new Date().toLocaleTimeString()
        };

        setMessages((m) => [...m, userMsg]);
        setLoading(true);

        try {
            const res = await askLegalBot(text, "auto", location, userName);

            const botMsg = {
                id: crypto.randomUUID(),
                role: "bot",
                answer: res.answer,
                resolution: res.possible_resolution,
                lawyers: res.nearby_lawyers,
                time: new Date().toLocaleTimeString(),
                originalQuery: text
            };

            setMessages((m) => [...m, botMsg]);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const stored = localStorage.getItem("legal-chat");
    //     if (stored) setMessages(JSON.parse(stored));
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem("legal-chat", JSON.stringify(messages));
    // }, [messages]);


    return (
        <div className="container">
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <h1 className="title">🇮🇳 Indian Legal Advisor</h1>
            <p className="subtitle">Constitution of India – Legal Assistant</p>

            <Disclaimer />

            {/* Name Input Scenario */}
            {!userName ? (
                <div className="card" style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
                    <ChatWindow messages={messages} />
                    <div className="row" style={{ marginTop: '20px' }}>
                        <input
                            placeholder="Enter your name..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                        />
                        <button className="primary-btn" style={{ marginTop: 0 }} onClick={handleNameSubmit}>Start</button>
                    </div>
                </div>
            ) : (
                <>
                    {showGuide ? (
                        <GuidedForm
                            onSubmit={(data) => {
                                setShowGuide(false);
                                sendMessage(
                                    `${data.category}: ${data.issue}`,
                                    data.city
                                );
                            }}
                        />
                    ) : (
                        <>
                            <ChatWindow
                                messages={messages}
                                loading={loading}
                                onRetry={sendMessage}
                            />
                            <QueryInput onSend={sendMessage} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
