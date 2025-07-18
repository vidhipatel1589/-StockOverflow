from app.core.database import engine
from app.models import Base

# ✅ THESE IMPORTS ARE REQUIRED
import app.models.product
import app.models.order

def create_all_tables():
    print("📦 Creating all tables...")
    print(Base.metadata.tables.keys())
    Base.metadata.create_all(bind=engine)
    print(Base.metadata.tables.keys())
    print("✅ Tables created successfully.")
    print("🧪 Tables registered with SQLAlchemy:")
    print(Base.metadata.tables.keys())

if __name__ == "__main__":
    create_all_tables()
