from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Table
from sqlalchemy.orm import relationship
from .database import Base

# Tabla intermedia para la relación Many-to-Many entre Posts y Tags
post_tags_table = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", Integer, ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)




class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    
    author = relationship("User")
    # Relación Many-to-Many con Tags
    tags = relationship("Tag", secondary=post_tags_table, back_populates="posts")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # Puntuación de 1 a 5
    created_at = Column(DateTime, default=func.now())

    # Relaciones
    post = relationship("Post")
    user = relationship("User")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    # Relación inversa con Posts
    posts = relationship("Post", secondary=post_tags_table, back_populates="tags")
