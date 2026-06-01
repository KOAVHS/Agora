import os
import smtplib
import ssl
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.confirmation import EmailConfirmation

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "agora-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 días

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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


def get_email_confirmation_link(token: str) -> str:
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    return f"{backend_url}/auth/confirm-email?token={token}"


def send_confirmation_email(email: str, token: str):
    confirmation_link = get_email_confirmation_link(token)
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    email_from = os.getenv("EMAIL_FROM", "no-reply@agora.app")
    subject = "Confirma tu cuenta Agora"
    body = (
        f"Hola!\n\nGracias por registrarte en Agora.\n"
        f"Haz clic en el siguiente enlace para confirmar tu correo:\n{confirmation_link}\n\n"
        "Si no solicitaste este correo, ignóralo."
    )

    if smtp_host and smtp_user and smtp_pass:
        message = f"Subject: {subject}\n\n{body}"
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_pass)
            server.sendmail(email_from, email, message)
    else:
        print("[INFO] Email de confirmación no enviado por SMTP porque no hay configuración.")
        print(f"[INFO] Link de confirmación: {confirmation_link}")


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

@router.post("/register", response_model=MessageSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    confirmation_token = uuid.uuid4().hex
    confirmation = EmailConfirmation(user_id=user.id, token=confirmation_token)
    db.add(confirmation)
    db.commit()

    try:
        send_confirmation_email(user.email, confirmation_token)
    except Exception as e:
        print(f"[ERROR] No se pudo enviar el email de confirmación: {e}")

    return {"message": "Registro exitoso. Revisa tu correo para confirmar la cuenta."}

@router.post("/login", response_model=TokenSchema)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    pending_confirmation = db.query(EmailConfirmation).filter(EmailConfirmation.user_id == user.id).first()
    if pending_confirmation:
        raise HTTPException(status_code=403, detail="Debes confirmar tu correo antes de iniciar sesión")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/confirm-email", response_model=MessageSchema)
def confirm_email(token: str, db: Session = Depends(get_db)):
    confirmation = db.query(EmailConfirmation).filter(EmailConfirmation.token == token).first()
    if not confirmation:
        raise HTTPException(status_code=404, detail="Token de confirmación inválido o expirado")

    db.delete(confirmation)
    db.commit()

    return {"message": "Correo confirmado correctamente. Ya puedes iniciar sesión."}

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user