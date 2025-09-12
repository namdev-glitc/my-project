from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TimestampMixin:
    created_at = None
    updated_at = None
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()





