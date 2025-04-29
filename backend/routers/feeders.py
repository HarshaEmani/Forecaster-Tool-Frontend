from fastapi import APIRouter
from db.db_manager_api import DBManager
from models.response_schemas import FeederListResponse

router = APIRouter()
db = DBManager()


@router.get("/", response_model=FeederListResponse)
async def get_feeders():
    feeder_ids = db.get_all_feeder_ids()
    return FeederListResponse(feeders=feeder_ids)
