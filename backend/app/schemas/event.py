from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None
    max_guests: Optional[int] = 100

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    max_guests: Optional[int] = None
    is_active: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True



