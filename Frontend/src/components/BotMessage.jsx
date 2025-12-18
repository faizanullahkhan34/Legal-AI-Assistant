import { useEffect, useState } from "react";
import LawyerList from "./LawyerList";

export default function BotMessage({ data, onRetry }) {
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let i = 0;
        setIsTyping(true);
        const interval = setInterval(() => {
            setText(data.answer.slice(0, i));
            i++;
            if (i > data.answer.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 18);

        return () => clearInterval(interval);
    }, [data.answer]);

    return (
        <div className="bot-msg">
            <div className="msg-header">
                <div className="avatar">🤖</div>
                <span>Legal Bot</span>
                <span className="time">{data.time}</span>
            </div>

            <p className="streaming-text">{text}</p>

            {!isTyping && data.lawyers && data.lawyers.length > 0 && (
                <LawyerList lawyers={data.lawyers} />
            )}

        </div>
    );
}
