# # scripts/inspect_tables.py

# from app.core.database import engine
# from app.models import product, order

# print("📦 Creating all tables...")
# product.Base.metadata.create_all(bind=engine)
# order.Base.metadata.create_all(bind=engine)
# print("✅ Done.")

from sqlalchemy.orm import declarative_base

Base = declarative_base()

