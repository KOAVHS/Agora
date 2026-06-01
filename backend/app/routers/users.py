from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

# ── Schemas ───────────────────────────────────────────────────────────────────

class SetupSchema(BaseModel):
    materia: str
    guia_id: str
    nivel: str
    horas_dia: str
    meta: str

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

# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/setup", response_model=UserOut)
def setup(
    data: SetupSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.materia = data.materia
    current_user.guia_id = data.guia_id
    current_user.nivel = data.nivel
    current_user.horas_dia = data.horas_dia
    current_user.meta = data.meta
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/guides")
def get_guides(current_user: User = Depends(get_current_user)):
    guides = [
        {
            "id": "free",
            "name": "Alex Mentor",
            "spec": "Aprendizaje General",
            "students": "24,100",
            "rating": "4.7",
            "is_premium": False,
            "is_ai": False,
            "color": "#2DD4BF",
            "initials": "AM",
        },
        {
            "id": "aria",
            "name": "Aria AI",
            "spec": "Ingeniería y Tecnología",
            "students": "18,500",
            "rating": "4.9",
            "is_premium": True,
            "is_ai": True,
            "color": "#7C3AED",
            "initials": "AI",
        },
        {
            "id": "nova",
            "name": "Nova AI",
            "spec": "Ciencias y Matemáticas",
            "students": "12,800",
            "rating": "4.9",
            "is_premium": True,
            "is_ai": True,
            "color": "#EC4899",
            "initials": "NV",
        },
    ]

    # Si no es premium, marcar las guías bloqueadas
    for g in guides:
        g["locked"] = g["is_premium"] and not current_user.is_premium

    return guides