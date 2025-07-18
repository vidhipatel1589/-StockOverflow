from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
import os

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from pathlib import Path

from pydantic import BaseModel
from backend.app import models
from backend.app.core.database import get_db
from backend.app.api.v1 import products, orders, clients, warehouses, costs, dashboard, employee_dashboard

from backend.app.api.v1.visualizer import router as optimizer_router

from backend.setup_db import setup as initialize_database

initialize_database()
app = FastAPI()

app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(costs.router, prefix="/api/v1", tags=["costs"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])
app.include_router(employee_dashboard.router, prefix="/api/v1", tags=["employee-dashboard"])
app.include_router(optimizer_router, prefix="/api/v1", tags=["optimizer"])


BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "static")
VISUAL_DIR = os.path.join(STATIC_DIR, "visualizations")
print("Looking for HTML in:", os.path.join(STATIC_DIR, "warehouse_visualizations"))

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

@app.get("/")
def root():
    return {"status": "ok"}

# === Enable CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


VIS_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=VIS_DIR / "static"), name="static")


# === JWT Setup ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "GM_FHkUk2jtUeSbW9p5NckVzNGAE07ukSKoAMoh7ZFU"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# === Routers ===
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(clients.router)
app.include_router(warehouses.router)

# === Pydantic Schemas ===
class SignupRequest(BaseModel):
    name: str
    email: str
    phone_number: str
    password: str
    role: str = "CLIENT"
    is_google_account: bool = False

class LoginRequest(BaseModel):
    email: str
    password: str

# === Token Generation ===
def create_access_token(data: dict, expires_in: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_in
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# === Routes ===
@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(request.password)
    new_user = models.User(
        role=request.role,
        email=request.email,
        phone_number=request.phone_number,
        address=None,
        password_hash=hashed_password,
        name=request.name,
        is_google_account=request.is_google_account
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful"}

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token_data = {"sub": str(user.user_id)}
    token = create_access_token(data=token_data)

    return {
        "token": token,
        "user": {
            "id": user.user_id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    }

@app.get("/static/warehouse_visualizations/{filename}")
def get_visualization(filename: str):
    file_path = os.path.join(STATIC_DIR, "warehouse_visualizations", filename)

    if os.path.isfile(file_path):
        print("File exists")
        return FileResponse(file_path, media_type="text/html")

    print("File not found")
    raise HTTPException(status_code=404, detail="File not found")