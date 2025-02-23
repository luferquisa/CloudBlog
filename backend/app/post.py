from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.get("/", status_code=200)
def get_posts(db: Session = Depends(get_db)):
    x = db.query(Post)
    response = x.all()
    return x.all()

@router.post("/")
def create_post(title: str, content: str, db: Session = Depends(get_db)):
    new_post = Post(author_id=1,title=title, content=content)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
