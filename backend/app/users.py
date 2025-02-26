from fastapi import FastAPI, Depends, HTTPException, status  
from pydantic import BaseModel  
from typing import Optional  
from datetime import datetime, timedelta  
from jose import JWTError, jwt  
from passlib.context import CryptContext  
import uuid  

app = FastAPI()  

# Configuración de seguridad  
SECRET_KEY = "tu_clave_secreta_unica_y_compleja"  
ALGORITHM = "HS256"  
ACCESS_TOKEN_EXPIRE_MINUTES = 30  

# Contexto para hashing de contraseñas  
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  

# Modelos Pydantic  
class UserCreate(BaseModel):  
    username: str  
    email: str  
    password: str  

class UserInDB(UserCreate):  
    id: str  
    hashed_password: str  

class Token(BaseModel):  
    access_token: str  
    token_type: str  

# Base de datos temporal para ejemplo  
fake_users_db = {}  

# Funciones de utilidad  
def get_password_hash(password):  
    return pwd_context.hash(password)  

def verify_password(plain_password, hashed_password):  
    return pwd_context.verify(plain_password, hashed_password)  

def create_access_token(data: dict):  
    to_encode = data.copy()  
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  
    to_encode.update({"exp": expire})  
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  
    return encoded_jwt  

# Endpoints  
@app.post("/users/register", response_model=UserInDB)  
async def register_user(user: UserCreate):  
    if user.username in fake_users_db:  
        raise HTTPException(  
            status_code=status.HTTP_400_BAD_REQUEST,  
            detail="El nombre de usuario ya existe"  
        )  
    
    hashed_password = get_password_hash(user.password)  
    user_id = str(uuid.uuid4())  
    db_user = UserInDB(  
        id=user_id,  
        username=user.username,  
        email=user.email,  
        password=user.password,  
        hashed_password=hashed_password  
    )  
    fake_users_db[user.username] = db_user.dict()  
    return db_user  

@app.post("/users/login", response_model=Token)  
async def login_for_access_token(username: str, password: str):  
    user = fake_users_db.get(username)  
    if not user or not verify_password(password, user["hashed_password"]):  
        raise HTTPException(  
            status_code=status.HTTP_401_UNAUTHORIZED,  
            detail="Credenciales inválidas",  
            headers={"WWW-Authenticate": "Bearer"},  
        )  
    access_token = create_access_token(data={"sub": user["username"]})  
    return {"access_token": access_token, "token_type": "bearer"}  

# Endpoint para recuperación de contraseña  
@app.post("/users/reset-password")  
async def reset_password(email: str):  
    # Lógica de recuperación de contraseña (implementar según necesidades)  
    return {"message": "Instrucciones enviadas al correo electrónico"}