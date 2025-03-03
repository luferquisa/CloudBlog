from pydantic import BaseModel, Field, constr,  validator
from typing import List, Optional
from html import escape


#Aqui se crean modelos que permiten darle estructura y validar los datos 

'''
validar las entradas con constr
Esto previene que un usuario envíe caracteres maliciosos.
Se eliminan espacios en blanco y se definen límites de longitud.
Protección contra XSS (Cross-Site Scripting) 
'''

#Modelo para asignar calificacion a un post
class RatingCreate(BaseModel):
    post_id: int
    user_id: int
    rating: int  # Entre 1 y 5

#Modelos para un tag
class TagBase(BaseModel):
    name: str =  constr(strip_whitespace=True, min_length=3, max_length=20)

    @validator("name", pre=True)
    def sanitize_text(cls, value):
        return escape(value)  # Sanitiza la entrada


class TagS(TagBase):
    id: int

class TagCreate(TagBase):
    pass

#Modelo para consultar un tag
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
    title: str = Field(..., min_length=3, max_length=100)
    content: str =  constr(strip_whitespace=True, min_length=10, max_length=5000)
    tags: List[TagBase]

    @validator("title", "content", pre=True)
    def sanitize_text(cls, value):
        return escape(value)  # Sanitiza la entrada

    @validator("tags", pre=True)
    def sanitize_tags(cls, tags):
        return [{"name": escape(tag["name"])} for tag in tags]  # Sanitiza los tags

    class Config:
        orm_mode = True

# Modelo para validar el cuerpo del POST
class PostUpdate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    content: str =  constr(strip_whitespace=True, min_length=10, max_length=5000)
    tags: List[TagBase]

    @validator("title", "content", pre=True)
    def sanitize_text(cls, value):
        return escape(value)  # Sanitiza la entrada

    @validator("tags", pre=True)
    def sanitize_tags(cls, tags):
        return [{"name": escape(tag["name"])} for tag in tags]  # Sanitiza los tags

    class Config:
        orm_mode = True

#Modelo para la creacion de usuarios
class UserCreate(BaseModel):
    username: str =  constr(strip_whitespace=True, min_length=3, max_length=20)
    email: str =  constr(strip_whitespace=True, min_length=3, max_length=30)
    password: str

    @validator("username", "email", pre=True)
    def sanitize_text(cls, value):
        return escape(value)  # Sanitiza la entrada

#Modelo para el login de usuarios
class UserLogin(BaseModel):
    email: str =  constr(strip_whitespace=True, min_length=3, max_length=5000)
    password:str

    @validator("email", pre=True)
    def sanitize_text(cls, value):
        return escape(value)  # Sanitiza la entrada