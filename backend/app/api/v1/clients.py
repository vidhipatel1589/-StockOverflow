from fastapi import APIRouter

router = APIRouter(tags=["Clients"], prefix="/clients")

@router.get("/")
def read_clients():
    return {"message": "List of clients"}
