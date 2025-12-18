export default function ThemeToggle({ theme, toggle }) {
    return (
        <button className="theme-toggle" onClick={toggle}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}
