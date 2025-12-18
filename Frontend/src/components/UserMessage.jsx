export default function UserMessage({ text, time }) {
    return (
        <div className="user-msg">
            <div className="msg-header">
                <span className="time">{time}</span>
                <span>You</span>
                <div className="avatar">👤</div>
            </div>
            <p>{text}</p>
        </div>
    );
}
