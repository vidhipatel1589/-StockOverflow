from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    name: int
    height: int
    width: int
    depth: int
    weight: int
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItem]

class OrderOut(OrderCreate):
    order_id: int  # Or however you name it in your DB

    class Config:
        orm_mode = True


# Product_ID = Column(Integer, primary_key=True, index=True)
#     Name = Column(String(100))
#     Height = Column(Float)
#     Width = Column(Float)
#     Depth = Column(Float)
#     Weight = Column(Float)
#     Quantity = Column(Float)
#     Temperature_requirement = Column(String(50))
#     Security_level = Column(String(50))