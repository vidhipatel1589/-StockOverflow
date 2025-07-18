from fastapi import APIRouter

router = APIRouter(tags=["Warehouses"], prefix="/warehouses")

@router.get("/")
def read_warehouses():
    return {"message": "List of warehouses"}
