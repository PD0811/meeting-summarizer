# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class MeetingCreate(BaseModel):
    title: Optional[str] = None

class MeetingOut(BaseModel):
    id: int
    title: Optional[str]
    filename: str
    transcript: Optional[str]
    summary: Optional[str]
    action_items: Optional[str]

    class Config:
        orm_mode = True
