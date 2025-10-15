# app/utils.py
import os
import uuid
from pathlib import Path

def ensure_storage_dir(path: str):
    os.makedirs(path, exist_ok=True)

def make_audio_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix or ".wav"
    return f"{uuid.uuid4().hex}{ext}"
