from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post
from .schemas import PostCreate

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.get("/", status_code=200)
def get_posts(db: Session = Depends(get_db)):
    x = db.query(Post)
    response = x.all()
    return x.all()

@router.post("/create")
def create_post(post: PostCreate,  db: Session = Depends(get_db)):
    new_post = Post(author_id=1,title=post.title, content=post.content)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@router.get("/{post_id}", status_code=200)
def get_posts_detail(post_id: int, db: Session = Depends(get_db)):
    response = db.query(Post).filter(Post.id == post_id).scalar()
    return response