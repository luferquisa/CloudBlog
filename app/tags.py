from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Tag, Post, PostTag
from .schemas import TagCreate, TagResponse

router = APIRouter(
    prefix="/tags",
    tags=["Tags"]
)

@router.post("/creartag", response_model=TagResponse)
def create_tag(tag_data: TagCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva etiqueta si no existe.
    """
    existing_tag = db.query(Tag).filter(Tag.name == tag_data.name).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="La etiqueta ya existe")

    new_tag = Tag(name=tag_data.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag


@router.get("/gettags", response_model=list[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    """
    Obtiene todas las etiquetas.
    """
    return db.query(Tag).all()


@router.get("/savetag")
def save_tags(post_id: int, tag_id: int, db: Session = Depends(get_db)):
    """
    Valida que las etiquetas existen
    """
    existing_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not existing_tag:
        raise HTTPException(status_code=400, detail="La etiqueta no existe")
    
    """
    Valida que  el post existe
    """
    existing_post = db.query(Post).filter(Post.id == post_id).first()
    if not existing_tag:
        raise HTTPException(status_code=400, detail="El post no existe")
    print(post_id)

    
    new_tag_post = PostTag(post_id=post_id,tag_id=tag_id)
    print(new_tag_post.post_id)
    
    db.add(new_tag_post)
    db.commit()
    db.refresh(new_tag_post)
        

