from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Guest(Base):
    __tablename__ = "guests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(20), nullable=True)  # Mr, Mrs, Dr, Prof. Dr.
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=True)
    organization = Column(String(200), nullable=True)
    tag = Column(String(50), nullable=True)  # Tag phân loại
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # QR Code
    qr_code = Column(String(500), nullable=True)  # QR code data
    qr_image_path = Column(String(200), nullable=True)  # Path to QR image
    
    # RSVP Status
    rsvp_status = Column(String(20), default="pending")  # pending, accepted, declined
    rsvp_response_date = Column(DateTime, nullable=True)
    rsvp_notes = Column(Text, nullable=True)
    
    # Check-in Status
    checked_in = Column(Boolean, default=False)
    check_in_time = Column(DateTime, nullable=True)
    check_in_location = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    event_id = Column(Integer, ForeignKey("events.id"))
    event = relationship("Event", back_populates="guests")
    
    def __repr__(self):
        return f"<Guest(id={self.id}, name='{self.name}', organization='{self.organization}')>"


