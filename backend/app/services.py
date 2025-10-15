# app/services.py (updated for openai>=1.0.0)
import os
import json
import re
from typing import Tuple
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment")

client = OpenAI(api_key=OPENAI_API_KEY)


def transcribe_file(file_path: str) -> str:
    """
    Transcribe using OpenAI Whisper (whisper-1).
    Returns plain text transcript.
    """
    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        return transcript.text


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

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in meeting summaries."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=600,
        temperature=0.2,
    )

    content = response.choices[0].message.content

    # Try to extract JSON
    match = re.search(r"\{[\s\S]*\}", content)
    if match:
        try:
            j = json.loads(match.group(0))
            summary = j.get("summary", "")
            decisions = j.get("decisions", [])
            action_items = j.get("action_items", [])
            action_text = "\n".join([f"- {a}" for a in action_items])
            decisions_text = "\n".join([f"- {d}" for d in decisions])
            combined_summary = summary + "\n\nKey decisions:\n" + decisions_text
            return combined_summary, action_text
        except json.JSONDecodeError:
            pass

    return content, ""
