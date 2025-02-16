from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post, User

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to CloudBlog API!"}

@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

@app.post("/posts")
def create_post(title: str, content: str, db: Session = Depends(get_db)):
    new_post = Post(author_id=1,title=title, content=content)
    db.add(new_post)
    db.commit()
    return {"message": "Post created successfully!"}
