from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import Base, engine
from app.routers import auth, users

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agora API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Agora API funcionando", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}