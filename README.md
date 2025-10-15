# Meeting Summarizer

Simple Meeting Summarizer: upload audio → transcribe (Whisper) → summarize (OpenAI chat model).

## Prereqs
- Python 3.10+
- Node 18+
- An OpenAI API Key (set as OPENAI_API_KEY)

## Backend setup
cd backend
python -m pip install -r requirements.txt
cp .env.example .env
# edit .env to add your OPENAI_API_KEY
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

API endpoints:
- POST /api/meetings/upload  (multipart/form-data: file, title)
- GET /api/meetings
- GET /api/meetings/{id}

## Frontend setup
cd frontend
npm install
npm run dev
Open the dev URL (Vite shows one, e.g. http://127.0.0.1:5173)

## Notes
- This reference implementation does synchronous transcription & summarization for simplicity. For production, offload transcription + LLM work to background jobs.
- Watch OpenAI file size & rate limits.
