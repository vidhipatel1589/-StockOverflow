from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from collections import Counter
from backend.optimizer.database import get_db

router = APIRouter()

# Cost per square meter per warehouse type
WAREHOUSE_COSTS = {
    "regular_regular": 50,
    "regular_cold": 70,
    "high_regular": 100,
    "high_cold": 200
}

WAREHOUSE_TO_CONTAINER = {
    "regular_regular": 1,
    "regular_cold": 3,
    "high_regular": 2,
    "high_cold": 4
}

CONTAINER_TO_LOCATION = {
    1: "(100,0,100)",
    2: "(0,10,100)",
    3: "(0,0,100)",
    4: "(0,0,200)"
}

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_products = 0
    warehouse_counts = Counter()
    all_products = []
    cost_by_category = {
        "Regular": 0.0,
        "High-Security": 0.0,
        "Temperature": 0.0
    }
    space_by_category = {
        "Regular": 0.0,
        "High-Security": 0.0,
        "Temperature": 0.0
    }

    for warehouse_key, cost_per_m2 in WAREHOUSE_COSTS.items():
        table_name = f"products_{warehouse_key}"

        try:
            rows = db.execute(text(f"SELECT id, name, width, depth, quantity FROM {table_name} ORDER BY id DESC"))
        except Exception as e:
            print(f"Skipping table {table_name}: {e}")
            continue

        for row in rows:
            width = float(row.width)
            depth = float(row.depth)
            quantity = int(row.quantity)
            area = width * depth * quantity
            cost = area * cost_per_m2

            total_products += 1
            warehouse_counts[warehouse_key] += 1

            container = WAREHOUSE_TO_CONTAINER.get(warehouse_key, "N/A")
            location = CONTAINER_TO_LOCATION.get(container, "(N/A)")
            all_products.append({
                "id": row.id,
                "name": row.name,
                "warehouse": warehouse_key.replace("_", ",").title(),
                "location": location,
                "container": container
            })

            if warehouse_key in ["regular_regular", "regular_cold"]:
                cost_by_category["Regular"] += cost
                space_by_category["Regular"] += area
            if warehouse_key in ["high_regular", "high_cold"]:
                cost_by_category["High-Security"] += cost
                space_by_category["High-Security"] += area
            if warehouse_key in ["regular_cold", "high_cold"]:
                cost_by_category["Temperature"] += cost
                space_by_category["Temperature"] += area

    last_products = sorted(all_products, key=lambda x: x["id"], reverse=True)[:3]
    most_used = warehouse_counts.most_common(1)
    most_used_warehouse = most_used[0][0].replace("_", ",").title() if most_used else "N/A"

    cost_chart = [{"name": k, "value": round(v, 2)} for k, v in cost_by_category.items()]
    space_chart = [{"name": k, "value": round(v, 2)} for k, v in space_by_category.items()]

    return {
        "total_products": total_products,
        "total_containers": len(set(p["container"] for p in all_products)),
        "total_monthly_cost": round(sum(x["value"] for x in cost_chart), 2),
        "total_storage_months": 6,
        "most_used_warehouse": most_used_warehouse,
        "last_products": last_products,
        "cost_chart": cost_chart,
        "space_chart": space_chart
    }
