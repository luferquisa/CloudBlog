from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .schemas import UserCreate, UserLogin
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer


# Configuración de seguridad  
SECRET_KEY = "tu_clave_secreta_unica_y_compleja"  
ALGORITHM = "HS256"  
ACCESS_TOKEN_EXPIRE_MINUTES = 30 

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

# Contexto para hashing de contraseñas  
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  

# Esquema de autenticación (Bearer Token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Funciones de utilidad  
def get_password_hash(password):  
    return pwd_context.hash(password)  

# Función para verificar contraseñas
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Función para generar JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Función para verificar el token en rutas protegidas
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")  # Extraer el ID del usuario
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

@router.post("/registrar")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    hashed_password = get_password_hash(user.password)  

    
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuario registrado exitosamente "}

# Ruta para iniciar sesión
@router.post("/login")
def login_user(usero: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == usero.email).first()
    if not user or not verify_password(usero.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
     
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer","user_id":user.id}