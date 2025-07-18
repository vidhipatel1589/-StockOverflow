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

# Warehouse to readable name
WAREHOUSE_LABELS = {
    "regular_regular": "Regular,Regular",
    "regular_cold": "Regular,Cold",
    "high_regular": "High,Regular",
    "high_cold": "High,Cold"
}

# Warehouse category mapping
WAREHOUSE_CATEGORIES = {
    "regular_regular": ("Regular",),
    "regular_cold": ("Regular", "Temperature"),
    "high_regular": ("High-Security",),
    "high_cold": ("High-Security", "Temperature"),
}


@router.get("/employee-dashboard")
def employee_dashboard(db: Session = Depends(get_db)):
    #total_clients = set()
    total_products = 0
    total_units = 4
    total_revenue = 0.0
    warehouse_counts = Counter()
    warehouse_table_data = []

    surface_chart = {
        "Regular": 0,
        "High-Security": 0,
        "Temperature": 0
    }

    revenue_chart = {
        "Regular": 0,
        "High-Security": 0,
        "Temperature": 0
    }

    for warehouse_key, cost_per_m2 in WAREHOUSE_COSTS.items():
        table = f"products_{warehouse_key}"
        label = WAREHOUSE_LABELS[warehouse_key]
        categories = WAREHOUSE_CATEGORIES[warehouse_key]

        try:
            rows = db.execute(text(f"SELECT name, width, depth, quantity FROM {table}")).fetchall()
        except Exception as e:
            print(f"Skipping {table}: {e}")
            continue

        warehouse_product_count = 0
        #warehouse_clients = set()

        for row in rows:
            width = float(row.width)
            depth = float(row.depth)
            quantity = int(row.quantity)

            area = width * depth * quantity
            cost = area * cost_per_m2

            warehouse_product_count += 1
            total_products += 1
            total_revenue += cost

            for cat in categories:
                surface_chart[cat] += area
                revenue_chart[cat] += cost

            # Fake client identity from name (can replace with real `client_id`)
            #warehouse_clients.add(row.name)

        warehouse_table_data.append({
            "name": label,
            "products": warehouse_product_count,
            #"clients": len(warehouse_clients)
        })

        #total_clients.update(warehouse_clients)
        warehouse_counts[warehouse_key] += warehouse_product_count

    most_used = warehouse_counts.most_common(1)
    most_used_warehouse = WAREHOUSE_LABELS[most_used[0][0]] if most_used else "N/A"

    return {
        "stats": {
           # "total_clients": len(total_clients),
            "total_units": total_units,
            "monthly_revenue": round(total_revenue, 2),
            "total_products": total_products,
            "most_used_warehouse": most_used_warehouse
        },
        "warehouse_table": warehouse_table_data,
        "chart_surface": [{"name": k, "value": round(v, 2)} for k, v in surface_chart.items()],
        "chart_revenue": [{"name": k, "value": round(v, 2)} for k, v in revenue_chart.items()]
    }
