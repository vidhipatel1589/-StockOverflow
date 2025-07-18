import csv
import os
import uuid

# CSV_PATH = "all_orders.csv"
CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../all_orders.csv"))

CURRENT_CLIENT_ID = None  # Holds session client ID

def append_to_order_csv(products: list, client_id: str = None):
    global CURRENT_CLIENT_ID

    CURRENT_CLIENT_ID = 21

    file_exists = os.path.isfile(CSV_PATH)
    print(f"📦 Appending {len(products)} products to {CSV_PATH} for client {CURRENT_CLIENT_ID}")

    with open(CSV_PATH, mode='a', newline='') as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "id", "width", "height", "depth", "weight", "volume",
                "security", "temperature", "clientid", "quantity"
            ])

        for prod in products:
            width = float(prod["width"])
            height = float(prod["height"])
            depth = float(prod["depth"])
            weight = float(prod["weight"])
            quantity = int(prod["quantity"])
            volume = width * height * depth
            product_id = f"p{uuid.uuid4().hex[:6]}"

            writer.writerow([
                product_id,
                width,
                height,
                depth,
                weight,
                volume,
                prod["security"].strip().lower(),
                prod["temperature"].strip().lower(),
                CURRENT_CLIENT_ID,
                quantity
            ])

    print(f"✅ Appended {len(products)} products to {CSV_PATH}")
    return CSV_PATH
