import os
from sqlalchemy import Column, Integer, String, Float, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy_utils import database_exists, create_database
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_NAME = os.getenv("MYSQL_DB", "storage_db")

url_without_db = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/mysql"
url_with_db = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# SQLAlchemy setup
engine = create_engine(url_with_db)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ORM Models
class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(255))
    timestamp = Column(String(255))
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer)
    quantity = Column(Integer)
    order = relationship("Order", back_populates="items")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Integer)
    security = Column(String(50))
    temperature = Column(String(50))

class ProductRegularRegular(Base):
    __tablename__ = "products_regular_regular"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Integer)

class ProductRegularCold(Base):
    __tablename__ = "products_regular_cold"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Integer)

class ProductHighRegular(Base):
    __tablename__ = "products_high_regular"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Integer)

class ProductHighCold(Base):
    __tablename__ = "products_high_cold"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    width = Column(Float)
    height = Column(Float)
    depth = Column(Float)
    weight = Column(Float)
    quantity = Column(Integer)

# Setup function
def setup():
    fallback_engine = create_engine(url_without_db)
    if not database_exists(engine.url):
        create_database(engine.url)
        print(f"Created database: {DB_NAME}")
    else:
        print(f"Database {DB_NAME} already exists.")

    Base.metadata.create_all(bind=engine)
    print("All tables created.")

if __name__ == "__main__":
    setup()
