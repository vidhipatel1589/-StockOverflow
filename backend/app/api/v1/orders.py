from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.core.database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order()
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(db_item)

    db.commit()
    return {"order_id": db_order.id, "message": "Order created"}