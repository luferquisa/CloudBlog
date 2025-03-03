from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import Post, User
from .post import router as post_router
from .rating import router as ratings_router
from .tags import router as tag_router
from .usuarios import router as usuarios_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer




app = FastAPI(
    title="backend seguridad blog",
    description="API con autenticación en FastAPI",
    version="1.0",
    docs_url="/docs",  # URL para Swagger UI
    redoc_url="/redoc",  # URL para ReDoc (opcional)
    openapi_url="/openapi.json"  # URL para el esquema OpenAPI
)




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login") 
# Configurar los orígenes permitidos
#Protección contra CSRF (Cross-Site Request Forgery)
origins = [
    "http://35.192.177.211:8080",  # Para pruebas en local con Create React App
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
app.include_router(usuarios_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CloudBlog API!"}

@app.get("/luisa")
def read_root():
    return {"message": "Welcome Luisa"}


