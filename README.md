# 🎧 Meeting Summarizer

An AI-powered tool that transcribes meeting audio using **OpenAI Whisper** and generates concise **summaries, key decisions, and action items** using **GPT (gpt-4o-mini)**.

---

## 🚀 Features
- Upload an audio file (`.mp3`, `.wav`, etc.)
- Automatic transcription using **Whisper**
- AI-generated meeting summary, key decisions, and action items
- Clean, modern React frontend
- FastAPI backend with SQLite storage

---

## 🧰 Prerequisites
Before running the project, ensure you have:

- **Python 3.10+**
- **Node.js 18+** (includes `npm`)
- A valid **OpenAI API key** from [OpenAI API Dashboard](https://platform.openai.com/api-keys)

---

## ⚙️ Environment Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/meeting-summarizer.git
cd meeting-summarizer
```

---

## 🧠 Backend Setup (FastAPI)

### 1️⃣ Create and activate a virtual environment

#### Windows PowerShell
```bash
cd backend
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.venv\Scripts\Activate.ps1
```

#### macOS/Linux
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Set up environment variables
Copy the example file and add your OpenAI key:
```bash
cp .env.example .env
```
Then open .env and set your key:
```bash
OPENAI_API_KEY=sk-your-openai-key-here
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
STORAGE_DIR=./storage
```

### 4️⃣ Run the backend server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## 💻 Frontend Setup (React + Vite)

### 1️⃣ Navigate to frontend
```bash
cd ../frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the development server
```bash
npm run dev
```
You’ll see output like:
```arduino
VITE v5.x.x  ready in 1000ms
➜  Local:   http://127.0.0.1:5173/
```
Open that link in your browser.
