from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Tag
from .schemas import TagCreate, TagResponse

router = APIRouter(
    prefix="/tags",
    tags=["Tags"]
)

@router.post("/", response_model=TagResponse)
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
'''
@router.get("/", response_model=list[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    """
    Obtiene todas las etiquetas.
    """
    return db.query(Tag).all()
'''