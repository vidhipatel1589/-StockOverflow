# auth.py
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv  # Import this to load .env file

# Load environment variables from .env file
load_dotenv()


SECRET_KEY = "GM_FHkUk2jtUeSbW9p5NckVzNGAE07ukSKoAMoh7ZFU"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=60)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Load key from environment variable (stored in .env file) or generate one (for dev only)
FERNET_KEY = b'mqWQ7igbEVs-_yzzvBfYxP1YyjQASUKs96N7v-_Vers='
fernet = Fernet(FERNET_KEY)

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
