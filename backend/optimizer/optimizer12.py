import csv
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from mpl_toolkits.mplot3d import Axes3D
from collections import defaultdict
import numpy as np
import random
import os
import mplcursors
import matplotlib.patches as mpatches
from matplotlib.patches import Rectangle
from matplotlib.patches import Patch
import plotly.graph_objects as go
import sys

# Warehouse and container constants (mm, kg)
WAREHOUSE_HEIGHT = 4200
WAREHOUSE_WIDTH = 4330
WAREHOUSE_DEPTH = 12000
WAREHOUSE_MAX_CAPACITY = 30000

CONTAINER_HEIGHT = WAREHOUSE_HEIGHT - 1200
CONTAINER_WIDTH = 1200
CONTAINER_DEPTH = 800
CONTAINER_WEIGHT = 2600

MIN_PRODUCT_HEIGHT = 50
MIN_PRODUCT_WIDTH = 50
MIN_PRODUCT_DEPTH = 50
MIN_PRODUCT_WEIGHT = 2

# warehouse width and depth in mm
# used for the graph of total % space used by each client
WAREHOUSE_DIMS = {
    ('regular', 'regular'): (4330, 12000),
    ('regular', 'cold'): (4330, 12000),
    ('high', 'regular'): (4330, 12000),
    ('high', 'cold'): (4330, 12000),
}

# warehouse pricing in USD per square meter used to calculate monthly cost
# security and temperature tags:
# RR - regular regular, RC - regular cold, HR - high regular, HC - high cold
WAREHOUSE_COSTS = {
    ('regular', 'regular'): 50,
    ('regular', 'cold'): 70,
    ('high', 'regular'): 100,
    ('high', 'cold'): 200,
}

# Define product and container classes
class Product:
    def __init__(self, id, width, height, depth, weight, volume, security, temperature, client_id, quantity):
        self.id = id
        self.width = int(width)
        self.height = int(height)
        self.depth = int(depth)
        self.weight = float(weight)
        self.volume = float(volume)
        self.security = security
        self.temperature = temperature
        self.client_id = client_id
        self.quantity = quantity

class Container:
    container_counter = 0  #static counter for container indexing

    def __init__(self, max_width, max_height, max_depth):
        self.id = Container.container_counter  
        Container.container_counter += 1
        self.max_width = max_width
        self.max_height = max_height
        self.max_depth = max_depth
        self.products = []
        self.positions = []  # (x, y, z) positions of each product inside container
        self.total_weight = 0

    # updated try_add to adjust for heavier prods being below light ones
    def try_add(self, product):
        if self.total_weight + product.weight > CONTAINER_WEIGHT:
            return False

        z = 0
        while z + product.height <= self.max_height:
            occupied = [
                (x, y, z, p.width, p.depth, p.height, p.weight)
                for p, (x, y, z) in zip(self.products, self.positions)
            ]
            for x in range(0, self.max_width - product.width + 1, 10):
                for y in range(0, self.max_depth - product.depth + 1, 10):
                    if is_space_free_with_weight(occupied, x, y, z, product):
                        self.products.append(product)
                        self.positions.append((x, y, z))
                        self.total_weight += product.weight
                        print(f"Placed product {product.id} from client {product.client_id} at ({x}, {y}, {z}) in container {self.id}")
                        return True
            z += 10  # Try next layer up

        return False

    def calculate_container_area(container):
        used_area = 0

        for product in container.products:
            base_area = product.dimension.width * product.dimension.depth #mm^2
            used_area += base_area

        return used_area / 1000000
    

# Helper to check overlap between two 3D boxes
def boxes_overlap(box1, box2):
    (x1, y1, z1, w1, d1, h1) = box1
    (x2, y2, z2, w2, d2, h2) = box2
    return not (x1 + w1 <= x2 or x2 + w2 <= x1 or
                y1 + d1 <= y2 or y2 + d2 <= y1 or
                z1 + h1 <= z2 or z2 + h2 <= z1)

# Check if a space is free for placing a new box
def is_space_free(occupied, x, y, z, width, depth, height):
    new_box = (x, y, z, width, depth, height)
    for (ox, oy, oz, ow, od, oh) in occupied:
        if boxes_overlap(new_box, (ox, oy, oz, ow, od, oh)):
            return False
    return True

# checks space so we don't place a heavier item on top of an item with a lighter weight
def is_space_free_with_weight(occupied, x, y, z, product):
    width, depth, height, weight = product.width, product.depth, product.height, product.weight
    new_box = (x, y, z, width, depth, height)
    for (ox, oy, oz, ow, od, oh, oweight) in occupied:
        existing_box = (ox, oy, oz, ow, od, oh)

        if boxes_overlap(new_box, existing_box):
            return False
        
        # check if product is placed atop the box
        if z == oz + oh: 
            if weight > oweight:
                return False
    return True


# Load and classify products with quantity support but without duplication of products based on quantity
def load_products(csv_path):
    classified = defaultdict(list)
    with open(csv_path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product = Product(
                id=row['id'],
                width=int(row['width']),
                height=int(row['height']),
                depth=int(row['depth']),
                weight=float(row['weight']),
                volume=float(row['volume']),
                security=row['security'].strip().lower(),
                temperature=row['temperature'].strip().lower(),
                client_id=row['clientid'],
                quantity=int(row.get('quantity', 1))
            )
            key = (product.security, product.temperature)
            classified[key].append(product)
    return classified



# Pack products into containers using a bin-packing approach
# when hovering over the products it'll show PID xQTY (id and quantity) but will not place that many products
# def pack_into_containers(products):
#     containers = []
#     products = sorted(products, key=lambda p: p.height, reverse=True)  #updated from sorting by volume to sorting by height!!!!
#     for p in products:
#         placed = False
#         for container in containers:
#             if container.try_add(p):
#                 placed = True
#                 break
#         if not placed:
#             height = max(p.height + 200, CONTAINER_HEIGHT) 
#             new_container = Container(CONTAINER_WIDTH, height, CONTAINER_DEPTH)
#             if new_container.try_add(p):
#                 containers.append(new_container)
#     return containers

# optimized packing to handle quantity,
# will be visualized in exact quantity not just in a label
def pack_into_containers(products):
    containers = []
    # Sort by height or volume if needed
    products = sorted(products, key=lambda p: p.height, reverse=True)

    for product in products:
        remaining = product.quantity
        while remaining > 0:
            placed = False
            for container in containers:
                # Create a shallow copy with quantity = 1
                product_copy = Product(
                    id=product.id,
                    width=product.width,
                    height=product.height,
                    depth=product.depth,
                    weight=product.weight,
                    volume=product.volume,
                    security=product.security,
                    temperature=product.temperature,
                    client_id=product.client_id,
                    quantity=1
                )
                if container.try_add(product_copy):
                    placed = True
                    remaining -= 1
                    break
            if not placed:
                height = max(product.height + 200, CONTAINER_HEIGHT)
                new_container = Container(CONTAINER_WIDTH, height, CONTAINER_DEPTH)
                product_copy = Product(
                    id=product.id,
                    width=product.width,
                    height=product.height,
                    depth=product.depth,
                    weight=product.weight,
                    volume=product.volume,
                    security=product.security,
                    temperature=product.temperature,
                    client_id=product.client_id,
                    quantity=1
                )
                new_container.try_add(product_copy)
                containers.append(new_container)
                remaining -= 1
    return containers


# option 2 of layout with prevention for exceeding warehouse dims
def layout_containers(containers):
    layout = []
    x, y, z = 0, 0, 0
    max_row_depth = 0
    for container in containers:
        if container.max_width > WAREHOUSE_WIDTH or container.max_depth > WAREHOUSE_DEPTH or container.max_height > WAREHOUSE_HEIGHT:
            print(f"Skipping container with size ({container.max_width}, {container.max_depth}, {container.max_height}) - too large for warehouse.")
            continue

        if x + container.max_width > WAREHOUSE_WIDTH:
            x = 0
            y += max_row_depth + 200
            max_row_depth = 0

        if y + container.max_depth > WAREHOUSE_DEPTH:
            x = 0
            y = 0
            z += container.max_height + 200

        if z + container.max_height > WAREHOUSE_HEIGHT:
            print(f"Skipping container at height {z} with height {container.max_height} - exceeds warehouse height.")
            continue

        layout.append((container, x, y, z))
        x += container.max_width
        max_row_depth = max(max_row_depth, container.max_depth)

    return layout



# trying to introduce plotly to the visualization so we get 3d movement in front end and not static images
def visualize_layouts_by_warehouse(warehouse_layouts, html_path):
    client_colors = {}

    for key, layout in warehouse_layouts.items():
        fig = go.Figure()
        annotations = []

        for container, cx, cy, cz in layout:
            cont_color = f'rgba({random.randint(0,255)}, {random.randint(0,255)}, {random.randint(0,255)}, 0.3)'
            # Draw transparent container box
            fig.add_trace(go.Mesh3d(
                x=[cx, cx+container.max_width, cx+container.max_width, cx, cx, cx+container.max_width, cx+container.max_width, cx],
                y=[cy, cy, cy+container.max_depth, cy+container.max_depth, cy, cy, cy+container.max_depth, cy+container.max_depth],
                z=[cz, cz, cz, cz, cz+container.max_height, cz+container.max_height, cz+container.max_height, cz+container.max_height],
                i=[0, 0, 0, 4, 5, 6, 7, 3, 1, 2, 6, 7], #vertices
                j=[1, 2, 3, 5, 6, 7, 4, 0, 5, 6, 2, 3],
                k=[2, 3, 0, 6, 7, 4, 5, 1, 6, 7, 3, 0],
                opacity=0.5,
                color=cont_color,
                name=f"Container {container.id}"
            ))

            for prod, (px, py, pz) in zip(container.products, container.positions):
                client_id = getattr(prod, 'clientid', 'unknown')
                if client_id not in client_colors:
                    client_colors[client_id] = 'rgb({}, {}, {})'.format(*[random.randint(0, 255) for _ in range(3)])
                color = client_colors[client_id]

                x0, y0, z0 = cx + px, cy + py, cz + pz
                w, d, h = prod.width, prod.depth, prod.height

                # Create cube as Mesh3d
                fig.add_trace(go.Mesh3d(
                    x=[x0, x0+w, x0+w, x0, x0, x0+w, x0+w, x0],
                    y=[y0, y0, y0+d, y0+d, y0, y0, y0+d, y0+d],
                    z=[z0, z0, z0, z0, z0+h, z0+h, z0+h, z0+h],
                    i=[0, 0, 0, 4, 5, 6, 7, 3, 1, 2, 6, 7],
                    j=[1, 2, 3, 5, 6, 7, 4, 0, 5, 6, 2, 3],
                    k=[2, 3, 0, 6, 7, 4, 5, 1, 6, 7, 3, 0],
                    opacity=0.8,
                    color=color,
                    name=str(client_id),
                    hovertext=f"{prod.id} x{getattr(prod, 'quantity', 1)}",
                    hoverinfo="text"
                ))

        # Axis limits
        fig.update_layout(
            title=f"Warehouse {key}",
            scene=dict(
                xaxis=dict(title="Width"),
                yaxis=dict(title="Depth"),
                zaxis=dict(title="Height"),
            ),
            width=1200,
            height=900,
            legend_title="Client ID",
            showlegend=True
        )
        # fig.show()
        fig.write_html(html_path)
        # we can also save the plots to html instead of using show()
        # fig.write_html(f"warehouse_{key}.html")
        


# Export layout to CSV
def export_layouts_to_csv(warehouse_layouts, output_path="container_layouts.csv"):
    with open(output_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            "Warehouse_Type", "Container_Index", "Container_X", "Container_Y", "Container_Z",
            "Product_ID", "Product_X", "Product_Y", "Product_Z", "Product_Width", "Product_Depth", "Product_Height", "Client_id"
        ])

        for warehouse_key, layout in warehouse_layouts.items():
            for idx, (container, cx, cy, cz) in enumerate(layout):
                for prod, (px, py, pz) in zip(container.products, container.positions):
                    writer.writerow([
                        f"{warehouse_key[0]}_{warehouse_key[1]}", idx, cx, cy, cz,
                        prod.id, cx + px, cy + py, cz + pz, prod.width, prod.depth, prod.height, prod.client_id
                    ])
    print(f"Exported layout to {output_path}")


# dealing with costs calculation
def calculate_monthly_costs(warehouse_layouts):
    client_costs = defaultdict(lambda: defaultdict(float))  # client_id -> (warehouse_type -> cost)

    for warehouse_key, layout in warehouse_layouts.items():
        price_per_m2 = WAREHOUSE_COSTS.get(warehouse_key, 0)

        for container, cx, cy, cz in layout:
            for product in container.products:
                area_mm2 = product.width * product.depth
                area_m2 = area_mm2 / 1_000_000
                cost = area_m2 * price_per_m2
                client_costs[product.client_id][warehouse_key] += cost

    return client_costs


# New helper function to calculate cost and space usage per client per warehouse
def calculate_costs_and_usage(warehouse_data):
    client_costs = defaultdict(lambda: defaultdict(float))
    client_space = defaultdict(lambda: defaultdict(float))
    total_space = defaultdict(float)

    for (security, temperature), containers in warehouse_data.items():
        warehouse_key = f"{security}_{temperature}"
        cost_per_sqm = WAREHOUSE_COSTS[(security, temperature)]

        for container_tuple in containers:
            container = container_tuple[0]

            for product in container.products:
                # Calculate area in m^2
                area = (product.width * product.depth) / 1_000_000  # from mm^2 to m^2
                client_id = product.client_id
                client_costs[client_id][warehouse_key] += area * cost_per_sqm
                client_space[client_id][warehouse_key] += area
                total_space[warehouse_key] += area

    return client_costs, client_space, total_space

# Visualization function to show cost breakdown per client per warehouse - to be used in client side dashboard
def plot_client_costs(client_costs, output_dir="static/client_costs"):
    os.makedirs(output_dir, exist_ok=True)
    for client, costs in client_costs.items():
        warehouses = list(costs.keys())
        values = list(costs.values())

        plt.figure(figsize=(8, 5))
        plt.bar(warehouses, values, color='skyblue')
        plt.title(f"Monthly Storage Cost Breakdown for Client {client}")
        plt.ylabel("Cost (USD)")
        plt.xlabel("Warehouse Type")
        plt.xticks(rotation=45)
        plt.tight_layout()
        image_path = os.path.join(output_dir, f"client_{client}_costs.png")
        plt.savefig(image_path)
        plt.close()


# Visualization function to show percentage space usage per client per warehouse - to be used in employee side dashboard
def plot_space_usage_percentages(client_space, total_space, output_dir = "static/client_space_usage"):
    os.makedirs(output_dir, exist_ok=True)
    for client, usage in client_space.items():
        labels = []
        percentages = []

        for warehouse, space in usage.items():
            total = total_space[warehouse]
            percent = (space / total) * 100 if total > 0 else 0
            labels.append(warehouse)
            percentages.append(percent)

        plt.figure(figsize=(8, 5))
        plt.bar(labels, percentages, color='orange')
        plt.title(f"Warehouse Space Usage by Client {client}")
        plt.ylabel("Percentage of Space Used (%)")
        plt.xlabel("Warehouse Type")
        plt.xticks(rotation=45)
        plt.tight_layout()
        image_path = os.path.join(output_dir, f"client_{client}_space_usage.png")
        plt.savefig(image_path)
        plt.close()


# visualization function to show the % warehouse space used by each client in total - to be displayed in employee side 
def plot_total_warehouse_usage(total_space, output_dir = "static/total_warehouse_usage"):
    os.makedirs(output_dir, exist_ok=True)
    labels = []
    percentages = []

    for (security, temperature), (width_mm, depth_mm) in WAREHOUSE_DIMS.items():
        warehouse_key = f"{security}_{temperature}"
        total_area = (width_mm * depth_mm) / 1_000_000  # mm² to m²
        used_area = total_space.get(warehouse_key, 0)
        percent_used = (used_area / total_area) * 100 if total_area > 0 else 0

        labels.append(warehouse_key)
        percentages.append(percent_used)

    plt.figure(figsize=(8, 5))
    plt.bar(labels, percentages, color='green')
    plt.title("Total Warehouse Surface Area Used (%)")
    plt.ylabel("Percentage Used (%)")
    plt.xlabel("Warehouse Type")
    plt.xticks(rotation=45)
    plt.tight_layout()
    image_path = os.path.join(output_dir, f"total_warehouse_usage.png")
    plt.savefig(image_path)
    plt.close()

# plot total revenue - employee side
def plot_total_revenue(client_costs, output_dir = "static/total_warehouse_revenue"):
    os.makedirs(output_dir, exist_ok=True)
    warehouse_totals = defaultdict(float)

    # Sum total revenue per warehouse type
    for client, warehouses in client_costs.items():
        for warehouse_key, cost in warehouses.items():
            warehouse_totals[warehouse_key] += cost

    # Plot
    warehouse_types = list(warehouse_totals.keys())
    revenues = [warehouse_totals[w] for w in warehouse_types]

    plt.figure(figsize=(10, 6))
    plt.bar(warehouse_types, revenues, color='violet')
    plt.xlabel('Warehouse Type (security,temperature)')
    plt.ylabel('Total Revenue ($)')
    plt.title('Total Warehouse Revenue per Warehouse Type')
    image_path = os.path.join(output_dir, f"total_warehouse_revenue.png")
    plt.savefig(image_path)
    plt.close()


def run_packing(csv_file_path): 
    classified = load_products(csv_file_path)
    warehouse_layouts = {}
    for key, products in classified.items():
        print(f"\nOptimizing for warehouse: {key}")
        containers = pack_into_containers(products)
        layout = layout_containers(containers)
        warehouse_layouts[key] = layout

    return warehouse_layouts

# get the warehouse visualization html file paths in the static/warehouse_visualizations folder
def get_warehouse_htmls(warehouse_layouts, output_dir = "static/warehouse_visualizations"):

    os.makedirs(output_dir, exist_ok=True)
    html_paths = {}

    for key, layout in warehouse_layouts.items():
        type_str = f"{key[0]}_{key[1]}"  # security_temperature
        html_filename = f"warehouse_{type_str}.html"
        html_path = os.path.join(output_dir, html_filename)

        visualize_layouts_by_warehouse({key: layout}, html_path)
        html_paths[key] = html_path  # Store path for frontend

    return html_paths

# Main execution
if __name__ == "__main__":
    csv_file = "all_orders.csv"
    os.makedirs("static", exist_ok=True)

    
    # classified = load_products(csv_file)

    warehouse_layouts = run_packing(csv_file)

    warehouse_visualization_htmls = get_warehouse_htmls(warehouse_layouts, output_dir="static/warehouse_visualizations")

    # visualize_layouts_by_warehouse(warehouse_layouts, html_path) #add output html path!
    export_layouts_to_csv(warehouse_layouts)


    client_costs, client_space, total_space = calculate_costs_and_usage(warehouse_layouts)

    for client_id, cost_by_type in client_costs.items():
        print(f"\nClient id: {client_id}: ")
        for wh_type, cost in cost_by_type.items():
            print(f"  Warehouse {wh_type}: ${cost:.2f} per month")

    plot_client_costs(client_costs, output_dir = "static/client_costs")
    plot_space_usage_percentages(client_space, total_space, "static/client_space_usage")
    plot_total_warehouse_usage(total_space, output_dir="static/total_warehouse_usage")
    plot_total_revenue(client_costs, "static/total_warehouse_revenue")

    
