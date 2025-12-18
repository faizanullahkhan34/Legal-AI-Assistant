# 🇮🇳 Indian Legal Advisor AI

A powerful AI-powered legal assistant designed to provide accurate legal guidance based on the **Constitution of India**. It combines **Retrieval-Augmented Generation (RAG)** with real-time **lawyer recommendations** to help users navigate legal complexities.

## ✨ Features

*   **🤖 AI Legal Counsel**: accurate answers to legal queries using the Constitution of India as ground truth.
*   **📚 RAG Architecture**: Uses FAISS vector search and Ollama (LLaMA 3) to retrieve relevant legal context.
*   **⚖️ Smart Lawyer Search**: Automatically detects the case type (Criminal, Family, Corporate, etc.) and finds relevant lawyers nearby using the Tavily API.
*   **📍 Location-Aware**: Auto-detects user location to provide localized lawyer recommendations.
*   **💬 Modern Chat Interface**: Sleek, responsive UI with typing indicators, streaming responses, and dark/light mode.
*   **⚡ Performance**: Implements **Redis Caching** for instant responses to common queries.
*   **🗣️ Voice & Text**: Supports both text and voice input (Voice feature in progress).

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Vanilla CSS (Modern, Responsive)
*   Axios

**Backend:**
*   FastAPI (Python)
*   LangChain & Ollama (LLM)
*   FAISS (Vector Database)
*   Redis (Caching)
*   Tavily API (Web Search)

## 🚀 Getting Started

### Prerequisites
*   **Node.js** & **npm**
*   **Python 3.10+**
*   **Ollama** installed and running with `llama3` model (`ollama pull llama3`).
*   **Redis** server running locally.

### 1. Backend Setup

```bash
cd Backened
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### 3. Environment Variables

Create a `.env` file in the `Backened` directory (optional if hardcoded, but recommended for keys):

```env
TAVILY_API_KEY=your_tavily_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📖 Usage

1.  Open the frontend (usually `http://localhost:5173`).
2.  Enter your name to start the session.
3.  Type a legal query (e.g., *"What are my rights if arrested?"*).
4.  The AI will answer based on the Constitution.
5.  If relevant, it will suggest **lawyers nearby** based on the detected legal category.

## 🤝 Contribution

Contributions are welcome!
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License.
