from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

'''
 '''

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)
'''





def verify_password(plain_password, hashed_password):  
    return pwd_context.verify(plain_password, hashed_password)  

def create_access_token(data: dict):  
    to_encode = data.copy()  
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  
    to_encode.update({"exp": expire})  
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  
    return encoded_jwt  
'''


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
'''