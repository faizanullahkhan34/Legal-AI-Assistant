import { useState, useEffect, useRef } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import Skeleton from "./Skeleton";
import TypingIndicator from "./TypingIndicator";
import ErrorMessage from "./ErrorMessage";

export default function ChatWindow({ messages, loading, onRetry }) {
    const bottomRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="chat-window card">
            {messages.map((m, i) =>
                m.role === "user" ? (
                    <UserMessage key={i} text={m.text} />
                ) : (
                    <BotMessage
                        key={i}
                        data={m}
                        onRetry={onRetry}
                    />
                )
            )}

            {loading && messages.length === 1 && <Skeleton />}
            {loading && messages.length > 1 && <TypingIndicator />}
            {error && <ErrorMessage text={error} />}

            <div ref={bottomRef} />
        </div>
    );
}
