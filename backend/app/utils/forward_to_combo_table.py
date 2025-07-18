from sqlalchemy import text
from sqlalchemy.orm import Session

def forward_product_to_combo_table(db: Session, product_id: int):
    print("Entered forward_product_to_combo_table")

    product = db.execute(
        text("""
            SELECT name, width, height, depth, weight, quantity, security, temperature
            FROM products WHERE id = :id
        """),
        {"id": product_id}
    ).mappings().first()

    if not product:
        raise ValueError("Product not found")

    print(f"Fetched product: {product}")

    security = str(product["security"]).strip().lower()
    temperature = str(product["temperature"]).strip().lower()
    table_name = f"products_{security}_{temperature}"

    allowed_tables = {
        "products_regular_regular",
        "products_regular_cold",
        "products_high_regular",
        "products_high_cold"
    }

    if table_name not in allowed_tables:
        raise ValueError(f"Invalid combo table: {table_name}")

    print(f"Target table: {table_name}")

    insert_sql = text(f"""
        INSERT INTO {table_name} (name, width, height, depth, weight, quantity)
        VALUES (:name, :width, :height, :depth, :weight, :quantity)
    """)

    try:
        db.execute(insert_sql, {
            "name": product["name"],
            "width": product["width"],
            "height": product["height"],
            "depth": product["depth"],
            "weight": product["weight"],
            "quantity": product["quantity"]
        })
        db.commit()
        print("Insert into combo table successful.")
    except Exception as e:
        print("Error inserting into combo table:", e)
        raise RuntimeError(f"Insert failed: {e}")
