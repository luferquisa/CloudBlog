from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post, User
from .post import router as post_router
from .rating import router as ratings_router
from .tags import router as tag_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar los orígenes permitidos
origins = [
    "https://5174-cs-863335159225-default.cs-us-east1-yeah.cloudshell.dev",  # Tu frontend en Cloud Shell
    "http://localhost:3000",  # Para pruebas en local con Create React App
    "http://localhost:5173",  # Para pruebas en local con Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir estos orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Permitir todos los encabezados
)


# Incluir los routers
app.include_router(post_router)
app.include_router(ratings_router)
app.include_router(tag_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CloudBlog API!"}

@app.get("/luisa")
def read_root():
    return {"message": "Welcome Luisa"}


