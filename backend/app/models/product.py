# from sqlalchemy import Column, Integer, String, Float, ForeignKey
# from sqlalchemy.orm import relationship, declarative_base
# from app.models import Base

# class Product(Base):
#     __tablename__ = "PRODUCT"
#     Product_ID = Column(Integer, primary_key=True, index=True)
#     Name = Column(String(100))
#     Height = Column(Float)
#     Width = Column(Float)
#     Depth = Column(Float)
#     Weight = Column(Float)
#     Quantity = Column(Float)
#     Temperature_requirement = Column(String(50))
#     Security_level = Column(String(50))


# class Order(Base):
#     __tablename__ = 'orders'
#     id = Column(Integer, primary_key=True, index=True)
#     items = relationship("OrderItem", back_populates="order")

# class OrderItem(Base):
#     __tablename__ = 'order_items'
#     id = Column(Integer, primary_key=True, index=True)
#     order_id = Column(Integer, ForeignKey("orders.id"))
#     product_id = Column(Integer, ForeignKey("products.id"))
#     quantity = Column(Integer)

#     order = relationship("Order", back_populates="items")
#     product = relationship("Product")

from sqlalchemy import Column, Integer, String, Float
from backend.app.models import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Float)
    security = Column(String(50))
    temperature = Column(String(50))