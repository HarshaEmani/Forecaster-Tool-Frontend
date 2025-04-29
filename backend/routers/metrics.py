from fastapi import APIRouter
from db.db_manager_api import DBManager
from models.response_schemas import MetricsResponse

router = APIRouter()
db = DBManager()


@router.get("/{feeder_id}", response_model=MetricsResponse)
async def get_metrics_for_feeder(feeder_id: int):
    forecasts_df = db.load_forecasts_for_api(feeder_id)
    if forecasts_df.empty:
        return MetricsResponse(peak_load=0.0, average_load=0.0)

    peak_load = forecasts_df["forecast_value"].max()
    average_load = forecasts_df["forecast_value"].mean()
    return MetricsResponse(peak_load=peak_load, average_load=average_load)
