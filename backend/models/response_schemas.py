from pydantic import BaseModel
from typing import List, Dict


class FeederListResponse(BaseModel):
    feeders: List[int]


class ForecastEntry(BaseModel):
    target_timestamp: str
    forecast_value: float
    actual_value: float


class ForecastListResponse(BaseModel):
    forecasts: List[ForecastEntry]


class MetricsResponse(BaseModel):
    peak_load: float
    average_load: float
