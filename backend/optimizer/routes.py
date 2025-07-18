# routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, UserLogin
from auth import hash_password, create_access_token, encrypt_data, decrypt_data, verify_password

router = APIRouter()

# Route for regular signup
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if the email already exists in the database
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Encrypt the email before saving it to the database
    encrypted_email = encrypt_data(user.email)
    
    # Hash the password before saving it
    hashed_pw = hash_password(user.password)
    
    # Create a new user object and save it to the database
    new_user = User(
        name=user.name,
        email=encrypted_email,
        phone_number=user.phone_number,
        password=hashed_pw,
        role=user.role,
        is_google_account=False  # <-- manually signed up
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return the newly created user
    return new_user

# Route for regular login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Check if the user exists in the database
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create an access token for the user
    token = create_access_token({"sub": db_user.email})

    # Return the access token and user details
    return {
        "token": token,
        "user": UserResponse.from_orm(db_user)
    }
