from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.event import Event
from ..schemas.event import EventCreate, EventUpdate, EventResponse
from datetime import datetime

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[EventResponse])
def get_events(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách sự kiện
    """
    query = db.query(Event)
    
    if is_active is not None:
        query = query.filter(Event.is_active == is_active)
    
    events = query.offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết một sự kiện
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    return event

@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """
    Tạo sự kiện mới
    """
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật thông tin sự kiện
    """
    try:
        print(f"Updating event {event_id} with data: {event_update.dict()}")
        
        db_event = db.query(Event).filter(Event.id == event_id).first()
        if not db_event:
            raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
        
        # Cập nhật các trường
        update_data = event_update.dict(exclude_unset=True)
        print(f"Update data: {update_data}")
        
        for field, value in update_data.items():
            print(f"Setting {field} = {value} (type: {type(value)})")
            setattr(db_event, field, value)
        
        db_event.updated_at = datetime.now()
        db.commit()
        db.refresh(db_event)
        
        print(f"Event updated successfully: {db_event.name}")
        return db_event
    except Exception as e:
        print(f"Error updating event: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """
    Xóa sự kiện
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    db.delete(event)
    db.commit()
    
    return {"message": "Đã xóa sự kiện thành công"}

@router.get("/{event_id}/stats")
def get_event_stats(event_id: int, db: Session = Depends(get_db)):
    """
    Lấy thống kê sự kiện
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    # Thống kê khách mời
    from ..models.guest import Guest
    guests_query = db.query(Guest).filter(Guest.event_id == event_id)
    
    total_guests = guests_query.count()
    checked_in = guests_query.filter(Guest.checked_in == True).count()
    rsvp_accepted = guests_query.filter(Guest.rsvp_status == "accepted").count()
    rsvp_declined = guests_query.filter(Guest.rsvp_status == "declined").count()
    rsvp_pending = guests_query.filter(Guest.rsvp_status == "pending").count()
    
    # Thống kê theo tổ chức
    from sqlalchemy import func
    org_stats = db.query(
        Guest.organization,
        func.count(Guest.id).label('count')
    ).filter(
        Guest.event_id == event_id,
        Guest.organization.isnot(None),
        Guest.organization != ''
    ).group_by(Guest.organization).all()
    
    return {
        "event": {
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "event_date": event.event_date,
            "location": event.location
        },
        "total_guests": total_guests,
        "checked_in": checked_in,
        "rsvp_accepted": rsvp_accepted,
        "rsvp_declined": rsvp_declined,
        "rsvp_pending": rsvp_pending,
        "check_in_rate": round(checked_in / total_guests * 100, 2) if total_guests > 0 else 0,
        "organizations": [
            {"name": org, "count": count} for org, count in org_stats
        ]
    }

