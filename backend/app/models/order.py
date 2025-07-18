# from app.models import Base
# from sqlalchemy import Column, Integer, ForeignKey
# from sqlalchemy.orm import relationship
# from sqlalchemy.ext.declarative import declarative_base
# from .product import Product

# Base = declarative_base()

# class Order(Base):
#     __tablename__ = "orders"
#     id = Column(Integer, primary_key=True, index=True)
#     items = relationship("OrderItem", back_populates="order")

# class OrderItem(Base):
#     __tablename__ = "order_items"
#     id = Column(Integer, primary_key=True, index=True)
#     order_id = Column(Integer, ForeignKey("orders.id"))
#     product_id = Column(Integer, ForeignKey("products.id"))
#     quantity = Column(Integer)

#     order = relationship("Order", back_populates="items")
#     product = relationship("Product")


from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)

    order = relationship("Order", back_populates="items")