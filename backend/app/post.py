from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session,  joinedload
from .database import get_db
from .models import Post, Tag
from .schemas import PostCreate, PostUpdate
from .usuarios import verify_token
from typing import List
from html import escape

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

#Enpoints para el manejo de post en el blog

#Listar todos los post paginados de a 10
@router.get("/", status_code=200)
def get_posts( str = Depends(verify_token),db: Session = Depends(get_db),skip: int = Query(0, alias="offset"),limit: int = Query(10, alias="limit")):
    x = db.query(Post).join(Post.author).offset(skip).limit(limit).options(joinedload(Post.tags)).options(joinedload(Post.author))
    response = x.all()
    return x.all()

#Crear un nuevo post
@router.post("/create")
def create_post(post: PostCreate, str = Depends(verify_token),db: Session = Depends(get_db)):
    new_post = Post(author_id=post.author,title=post.title, content=post.content)
    # Manejar etiquetas
    post_tags = []
    for tag_name in post.tags:
        tag_san = escape(tag_name.name);
        existing_tag = db.query(Tag).filter(Tag.name == tag_san).first()
        if not existing_tag:
            existing_tag = Tag(name=tag_san)
            db.add(existing_tag)
            db.commit()
            db.refresh(existing_tag)
        post_tags.append(existing_tag)

    new_post.tags = post_tags
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

#Consultar pod por id
@router.get("/{post_id}", status_code=200)
def get_posts_detail(post_id: int,  str = Depends(verify_token), db: Session = Depends(get_db)):
    response = db.query(Post).join(Post.author).options(joinedload(Post.author)).options(joinedload(Post.tags)).filter(Post.id == post_id).scalar()
    return response

#Borrar post
@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(post)
    db.commit()
    return {"message": "Post eliminado exitosamente"}

#Actualizar post
@router.put("/postsupdate/{post_id}")
def update_post(post_id: int, post_data: PostUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")

    post.title = post_data.title
    post.content = post_data.content

    # Manejo de etiquetas (actualizar las etiquetas del post)
    post.tags.clear()  # Limpiar etiquetas actuales
    for tag_obj in post_data.tags:
        tag_name = tag_obj.name
        existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
        
        if not existing_tag:
            existing_tag = Tag(name=tag_name)
            db.add(existing_tag)
            db.commit()
            db.refresh(existing_tag)

        post.tags.append(existing_tag)

    db.commit()
    db.refresh(post)

    return post

@router.get("/posts-by-tag/{tag_id}", response_model=List[dict])
def get_posts_by_tag(tag_id: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los posts que contienen un tag específico.
    """
    posts = db.query(Post).join(Post.tags).filter(Tag.id == tag_id).all()
    return [{"id": post.id, "title": post.title, "content": post.content} for post in posts]
