from backend.app.utils.forward_to_combo_table import forward_product_to_combo_table
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductOut
from backend.app.utils.forward_to_combo_table import forward_product_to_combo_table
from backend.app import models
from backend.app.core.database import get_db
from backend.optimizer.database import get_db
from typing import List, Optional
from pydantic import BaseModel
from backend.app.utils.csv_writer import append_to_order_csv 
 
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#create + forward the product to correct table/warehouse
@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    try:
        forward_product_to_combo_table(db, db_product.id)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Forwarding failed: {e}")

    return db_product

# @router.get("/{product_id}", response_model=ProductOut)
# def get_product(product_id: int, db: Session = Depends(get_db)):
#     # return db.query(Product).filter(Product.Product_ID == product_id).first()
#     return db.query(Product).all()

#get all?
@router.get("/", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

#existing create and get all
@router.get("/", response_model=List[ProductOut])
def get_products(name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    if name:
        query = query.filter(Product.name.ilike(f"%{name}%"))
    return query.all()

#get product by ID
@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


#update product by ID
@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, updated: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in updated.dict().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


#delete product by ID
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully"}


# #assign product to warehouse
# @router.post("/", response_model=ProductOut)
# def create_product(product: ProductCreate, db: Session = Depends(get_db)):
#     return insert_product_by_combination(db, product.dict())

#duplicate product into right warehouse
@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    forward_product_to_combo_table(db, db_product.id)
    print(f"Forwarding product ID {db_product.id} to combo table")
    db.refresh(db_product)

    #debugging
    print("POST route hit — calling forward_product_to_combo_table")
    forward_product_to_combo_table(db, db_product.id)

    return db_product

# forward products
@router.post("/products/{product_id}/forward")
def forward_product(product_id: int, db: Session = Depends(get_db)):
    forward_product_to_combo_table(db, product_id)
    return {"status": "forwarded"}



@router.post("/submit-order")
def submit_order(products: list[dict], db: Session = Depends(get_db)):
    try:
        for prod in products:
            db_product = models.Product(
                name=prod["name"],
                width=prod["width"],
                height=prod["height"],
                depth=prod["depth"],
                weight=prod["weight"],
                quantity=prod["quantity"],
                security=prod["security"],
                temperature=prod["temperature"],
            )
            db.add(db_product)
        db.commit()

        append_to_order_csv(products)

        return {"status": "Order submitted and added to optimizer CSV."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit order: {str(e)}")