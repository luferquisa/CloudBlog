from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post, User
from .post import router as post_router
from .rating import router as ratings_router
from .tags import router as tag_router

app = FastAPI()

# Incluir los routers
app.include_router(post_router)
app.include_router(ratings_router)
app.include_router(tag_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CloudBlog API!"}

@app.get("/luisa")
def read_root():
    return {"message": "Welcome Luisa"}


