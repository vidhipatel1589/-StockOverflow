from pydantic import BaseModel
from datetime import date, time

# User Models
class UserCreate(BaseModel):
    name: str
    email: str
    phone_number: str
    password: str
    role: str = "CLIENT"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str
    role: str
    is_google_account: bool

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuth(BaseModel):
    token: str

# Product Models
class ProductBase(BaseModel):
    Name: str
    Height: float
    Width: float
    Depth: float
    Weight: float
    Price: float
    Temperature_requirement: float
    Security_level: int

class ProductCreate(ProductBase): 
    pass

class ProductOut(ProductBase):
    Product_ID: int

    class Config:
        orm_mode = True

# Client Models
class ClientBase(BaseModel):
    Name: str
    Title_Role: str
    Phone_nr: str
    Email: str
    Address: str
    Company_name: str
    Nr_of_rented_warehouses: int

class ClientOut(ClientBase):
    Client_ID: int

    class Config:
        orm_mode = True
