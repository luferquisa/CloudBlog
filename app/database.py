from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "blog_user:Pass123@localhost/blog_db"

engine = create_engine(
    f"postgresql+psycopg2://{DATABASE_URL}"
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency para obtener una sesión de DB en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
