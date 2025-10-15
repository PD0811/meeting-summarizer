# app/main.py
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import shutil
from pathlib import Path
import aiofiles

from .db import Base, engine, SessionLocal
from . import models, schemas
from .utils import ensure_storage_dir, make_audio_filename
from .services import transcribe_file, summarize_transcript

load_dotenv()

STORAGE_DIR = os.getenv("STORAGE_DIR", "./storage")
ensure_storage_dir(STORAGE_DIR)

# create DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Meeting Summarizer API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/meetings/upload", response_model=schemas.MeetingOut)
async def upload_meeting_audio(
    file: UploadFile = File(...),
    title: str = Form(None),
    db: Session = Depends(get_db)
):
    # Save file
    filename = make_audio_filename(file.filename)
    out_path = Path(STORAGE_DIR) / filename
    # async write
    async with aiofiles.open(out_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # create db record
    m = models.Meeting(title=title, filename=str(out_path))
    db.add(m)
    db.commit()
    db.refresh(m)

    # Transcribe (blocking CPU / network call) - you may want to run this in background for large audio
    try:
        transcript = transcribe_file(str(out_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {e}")

    # Summarize
    try:
        summary, action_items = summarize_transcript(transcript)
    except Exception as e:
        summary = ""
        action_items = ""

    # update record
    m.transcript = transcript
    m.summary = summary
    m.action_items = action_items
    db.add(m)
    db.commit()
    db.refresh(m)

    return m

@app.get("/api/meetings/{meeting_id}", response_model=schemas.MeetingOut)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    m = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return m

@app.get("/api/meetings", response_model=list[schemas.MeetingOut])
def list_meetings(db: Session = Depends(get_db)):
    rows = db.query(models.Meeting).order_by(models.Meeting.created_at.desc()).all()
    return rows
