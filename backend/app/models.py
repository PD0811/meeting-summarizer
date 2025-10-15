# app/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .db import Base

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), nullable=True)
    filename = Column(String(500), nullable=False)
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
