from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post, User
from .post import router as post_router

app = FastAPI()

# Incluir los routers
app.include_router(post_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CloudBlog API!"}


