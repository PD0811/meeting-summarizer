# app/services.py
import os
import openai
from typing import Tuple
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment")
openai.api_key = OPENAI_API_KEY

def transcribe_file(file_path: str) -> str:
    """
    Transcribe using OpenAI Whisper (whisper-1).
    Returns plain text transcript.
    """
    # Open the audio file in binary
    with open(file_path, "rb") as audio_file:
        # This usage is consistent with examples in public docs / community samples
        # It will return a dict-like object; adjust if your client returns different shape.
        transcript_resp = openai.Audio.transcribe("whisper-1", audio_file)
        # many examples return {"text": "..."}
        text = transcript_resp.get("text") if isinstance(transcript_resp, dict) else str(transcript_resp)
        return text or ""

def summarize_transcript(transcript: str) -> Tuple[str, str]:
    """
    Ask an LLM to produce a short summary and extract action items.
    Returns (summary, action_items_text).
    """
    prompt = (
        "You are an assistant that converts meeting transcripts into concise summaries, "
        "key decisions, and action items. Produce:\n\n"
        "1) A 2-4 sentence summary of the meeting.\n"
        "2) Bullet list of Key Decisions.\n"
        "3) Numbered Action Items (who, what, by when when possible).\n\n"
        "Meeting transcript:\n\n"
        f"{transcript}\n\n"
        "Output in JSON with fields: summary, decisions (array), action_items (array)."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role":"system", "content":"You are a helpful assistant specialized in meeting summaries."},
            {"role":"user", "content": prompt}
        ],
        max_tokens=600,
        temperature=0.2,
    )

    # Extract text
    content = ""
    if response and "choices" in response:
        content = response["choices"][0]["message"]["content"]
    # We'll try to parse a JSON block inside the response; fallback to raw text
    import json, re
    m = re.search(r"\{[\s\S]*\}", content)
    if m:
        try:
            j = json.loads(m.group(0))
            summary = j.get("summary", "")
            decisions = j.get("decisions", [])
            action_items = j.get("action_items", [])
            action_text = "\n".join([f"- {a}" for a in action_items])
            decisions_text = "\n".join([f"- {d}" for d in decisions])
            combined_summary = summary + "\n\nKey decisions:\n" + decisions_text
            return combined_summary, action_text
        except json.JSONDecodeError:
            pass

    # Fallback: return full content as summary and empty action items
    return content, ""
