export default function VoiceInput({ onText }) {
    const start = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "hi-IN"; // or en-IN
        recognition.interimResults = false;

        recognition.onresult = (e) => {
            onText(e.results[0][0].transcript);
        };

        recognition.start();
    };

    return (
        <button onClick={start} className="voice-btn">
            🎤 Speak
        </button>
    );
}
