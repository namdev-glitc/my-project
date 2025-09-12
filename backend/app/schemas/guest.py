from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class GuestBase(BaseModel):
    title: Optional[str] = None
    name: str
    role: Optional[str] = None
    organization: Optional[str] = None
    tag: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    @validator('email')
    def validate_email(cls, v):
        if v is None or v == '':
            return None
        # Simple email validation
        if '@' in v and '.' in v.split('@')[-1]:
            return v
        return None

class GuestCreate(GuestBase):
    event_id: int

class GuestUpdate(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    organization: Optional[str] = None
    tag: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    rsvp_status: Optional[str] = None
    rsvp_notes: Optional[str] = None

    @validator('email')
    def validate_email(cls, v):
        if v is None or v == '':
            return None
        # Simple email validation
        if '@' in v and '.' in v.split('@')[-1]:
            return v
        return None

class GuestResponse(GuestBase):
    id: int
    qr_code: Optional[str] = None
    qr_image_path: Optional[str] = None
    qr_image_url: Optional[str] = None
    rsvp_status: str
    rsvp_response_date: Optional[datetime] = None
    rsvp_notes: Optional[str] = None
    checked_in: bool
    check_in_time: Optional[datetime] = None
    check_in_location: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    event_id: int
    
    class Config:
        from_attributes = True

class GuestRSVP(BaseModel):
    rsvp_status: str  # accepted, declined
    rsvp_notes: Optional[str] = None

class GuestCheckIn(BaseModel):
    check_in_location: Optional[str] = None



