from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.optimizer.database import get_db

router = APIRouter()

WAREHOUSE_COSTS = {
    "regular_regular": 50,
    "regular_cold": 70,
    "high_regular": 100,
    "high_cold": 200
}

@router.get("/cost-breakdown")
def calculate_warehouse_costs(db: Session = Depends(get_db)):
    cost_summary = {}

    for key, cost_per_m2 in WAREHOUSE_COSTS.items():
        table_name = f"products_{key}"
        sql = text(f"SELECT width, depth, quantity FROM {table_name}")
        results = db.execute(sql).fetchall()

        total_area = 0.0
        for row in results:
            area = float(row.width) * float(row.depth) * int(row.quantity)
            total_area += area

        total_cost = total_area * cost_per_m2
        cost_summary[key] = {
            "total_area": round(total_area, 2),
            "cost_per_m2": cost_per_m2,
            "total_cost": round(total_cost, 2)
        }

    return cost_summary
