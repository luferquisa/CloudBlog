from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Rating, Post, User, func
from .schemas import RatingCreate

router = APIRouter(
    prefix="/ratings",
    tags=["Ratings"]
)

@router.get("/posts/average")
def get_posts_with_average_ratings(db: Session = Depends(get_db)):
    """
    Obtiene todos los posts con su promedio de calificación.
    """
    posts_with_ratings = (
        db.query(
            Post.id,
            Post.title,
            func.coalesce(func.avg(Rating.rating), 0).label("average_rating")
        )
        .outerjoin(Rating, Post.id == Rating.post_id)
        .group_by(Post.id)
        .all()
    )

    return [
        {
            "post_id": post.id,
            "title": post.title,
            "average_rating": round(post.average_rating, 2)  # Redondeamos a 2 decimales
        }
        for post in posts_with_ratings
    ]

@router.get("/{post_id}/average")
def get_average_rating(post_id: int, db: Session = Depends(get_db)):
    """
    Obtiene el promedio de calificaciones para un post específico.
    """
    average_rating = db.query(func.avg(Rating.rating)).filter(Rating.post_id == post_id).scalar()

    return {
        "post_id": post_id,
        "average_rating": round(average_rating, 2) if average_rating else 0
    }

@router.post("/")
def rate_post(rating_data: RatingCreate, db: Session = Depends(get_db)):
    """
    Permite a un usuario asignar una calificación a un post.
    {
        "post_id": 1,
        "user_id": 2,
        "rating": 5
    }
    """
    
    # Verificar si el post existe
    print(f"Recibida calificación: {rating_data.rating} para el post {rating_data.post_id}")
    
    post = db.query(Post.id).filter(Post.id == rating_data.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Verificar si el usuario existe
    user = db.query(User).filter(User.id == rating_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar que la calificación esté entre 1 y 5
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(status_code=400, detail="La calificación debe estar entre 1 y 5")

    # Crear una nueva calificación
    new_rating = Rating(**rating_data.dict())
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
