from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./guest_management.db")

# Create engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # Enable connection health checks and recycling to avoid stale connections
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=10,
        max_overflow=20
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


