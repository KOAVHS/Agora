import os
import secrets


from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "agora-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 días

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ── Schemas ──────────────────────────────────────────────────────────────────

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class MessageSchema(BaseModel):
    message: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool
    roadmap_created: bool
    is_premium: bool
    materia: str | None
    nivel: str | None
    meta: str | None
    horas_dia: str | None
    guia_id: str | None
    streak: int

    class Config:
        from_attributes = True

# ── Helpers ───────────────────────────────────────────────────────────────────

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def hash_password(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    verification_token = secrets.token_urlsafe(32)
    
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_verified=False,
        verification_token=verification_token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Enviar email de verificación
    try:
        from app.email import send_verification_email
        send_verification_email(data.email, data.name, verification_token)
    except Exception as e:
        print(f"Error enviando email: {e}")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Token inválido")
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "¡Cuenta verificada! Ya puedes iniciar sesión en Agora."}


@router.post("/login", response_model=TokenSchema)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user