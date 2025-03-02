from pydantic import BaseModel
from typing import List, Optional

class RatingCreate(BaseModel):
    post_id: int
    user_id: int
    rating: int  # Entre 1 y 5

class TagBase(BaseModel):
    name: str


class TagS(TagBase):
    id: int

class TagCreate(TagBase):
    pass

class TagResponse(TagCreate):
    id: int

    class Config:
        orm_mode = True

class TagS(TagBase):
    id: int

    class Config:
        orm_mode = True

# Modelo para validar el cuerpo del POST
class PostCreate(BaseModel):
    author: int
    title: str
    content: str
    tags: List[TagBase]

    class Config:
        orm_mode = True

# Modelo para validar el cuerpo del POST
class PostUpdate(BaseModel):
    title: str
    content: str
    tags: List[TagBase]

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email:str
    password:str