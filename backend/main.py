from fastapi import FastAPI
from routers import feeders, forecasts, metrics
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# load_dotenv()  # Load SUPABASE_URL and SUPABASE_SECRET_KEY

app = FastAPI(title="Forecast Viewer API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For now allow all origins; lock down later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(feeders.router, prefix="/feeders", tags=["feeders"])
app.include_router(forecasts.router, prefix="/forecasts", tags=["forecasts"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])


@app.get("/")
async def root():
    return {"message": "Forecast Viewer Backend Running!"}
