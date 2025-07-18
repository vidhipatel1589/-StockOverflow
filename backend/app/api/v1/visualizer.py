from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import os

from backend.optimizer.optimizer12 import (
    run_packing,
    get_warehouse_htmls,
    export_layouts_to_csv,
    calculate_costs_and_usage,
    plot_client_costs,
    plot_space_usage_percentages,
    plot_total_warehouse_usage,
    plot_total_revenue
)

router = APIRouter()

@router.get("/run-optimizer")
def run_optimizer_and_get_visuals():
    try:
        input_csv = "sample_products_client.csv"  # Adjust as needed
        warehouse_layouts = run_packing(input_csv)

        # Generate HTML files
        html_paths = get_warehouse_htmls(warehouse_layouts)

        # Save CSV + generate cost visualizations
        export_layouts_to_csv(warehouse_layouts)
        client_costs, client_space, total_space = calculate_costs_and_usage(warehouse_layouts)
        plot_client_costs(client_costs)
        plot_space_usage_percentages(client_space, total_space)
        plot_total_warehouse_usage(total_space)
        plot_total_revenue(client_costs)

        # Return accessible URLs to frontend
        urls = {
            f"{key[0].capitalize()},{key[1].capitalize()}": f"/static/warehouse_visualizations/warehouse_{key[0]}_{key[1]}.html"
            for key in html_paths.keys()
        }

        return JSONResponse(content=urls)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
