from fastapi import APIRouter
from db.db_manager_api import DBManager
from models.response_schemas import ForecastListResponse

router = APIRouter()
db = DBManager()


@router.get("/{feeder_id}", response_model=ForecastListResponse)
async def get_forecasts_for_feeder(feeder_id: int):
    forecasts_df = db.load_forecasts_for_api(feeder_id)
    return ForecastListResponse(forecasts=forecasts_df.to_dict(orient="records"))
