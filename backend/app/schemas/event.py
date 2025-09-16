from pydantic import BaseModel, validator
from typing import Optional, Union
from datetime import datetime

class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    event_date: Union[datetime, str]
    location: Optional[str] = None
    max_guests: Optional[int] = 100
    is_active: Optional[bool] = True
    
    @validator('event_date', pre=True)
    def parse_event_date(cls, v):
        if isinstance(v, str):
            try:
                # Handle ISO format with Z suffix
                if v.endswith('Z'):
                    v = v.replace('Z', '+00:00')
                return datetime.fromisoformat(v)
            except ValueError:
                # Simple fallback for common formats
                try:
                    # Try parsing YYYY-MM-DD format
                    if len(v) == 10 and v.count('-') == 2:
                        return datetime.strptime(v, '%Y-%m-%d')
                    raise ValueError(f"Invalid date format: {v}")
                except:
                    raise ValueError(f"Invalid date format: {v}")
        return v
    
    class Config:
        extra = "ignore"  # Ignore extra fields

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[Union[datetime, str]] = None
    location: Optional[str] = None
    max_guests: Optional[int] = None
    is_active: Optional[bool] = None
    
    @validator('event_date', pre=True)
    def parse_event_date(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            try:
                # Handle ISO format with Z suffix
                if v.endswith('Z'):
                    v = v.replace('Z', '+00:00')
                return datetime.fromisoformat(v)
            except ValueError:
                # Simple fallback for common formats
                try:
                    # Try parsing YYYY-MM-DD format
                    if len(v) == 10 and v.count('-') == 2:
                        return datetime.strptime(v, '%Y-%m-%d')
                    raise ValueError(f"Invalid date format: {v}")
                except:
                    raise ValueError(f"Invalid date format: {v}")
        return v
    
    class Config:
        extra = "ignore"  # Ignore extra fields

class EventResponse(EventBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True



