"""
VARSHA Backend — FastAPI server
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from score_engine import calculate_all_ward_scores, get_city_summary

app = FastAPI(
    title="VARSHA API",
    description="Vulnerability Assessment & Risk Scoring for Hydrological Analysis",
    version="1.0.0",
)

# Allow the React frontend (running on port 5173) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compute scores once at startup (not on every request)
WARD_GEOJSON = calculate_all_ward_scores()
CITY_SUMMARY = get_city_summary(WARD_GEOJSON)


@app.get("/")
def root():
    return {"message": "VARSHA API is running", "version": "1.0.0"}


@app.get("/api/wards")
def get_all_wards():
    """
    Returns GeoJSON FeatureCollection of all Delhi wards with flood scores.
    This is what the map consumes.
    """
    return WARD_GEOJSON


@app.get("/api/ward/{ward_id}")
def get_ward_detail(ward_id: int):
    """Returns detailed info and scores for a single ward"""
    for feature in WARD_GEOJSON["features"]:
        if feature["properties"]["id"] == ward_id:
            return feature["properties"]
    raise HTTPException(status_code=404, detail=f"Ward with id {ward_id} not found")


@app.get("/api/summary")
def get_summary():
    """Returns city-level aggregated readiness summary"""
    return CITY_SUMMARY


@app.get("/api/wards/risk/{level}")
def get_wards_by_risk(level: str):
    """Filter wards by risk level: CRITICAL, HIGH, MODERATE, LOW"""
    level = level.upper()
    valid = ["CRITICAL", "HIGH", "MODERATE", "LOW"]
    if level not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid level. Choose from: {valid}")

    filtered = [
        f for f in WARD_GEOJSON["features"]
        if f["properties"]["risk_level"] == level
    ]
    return {"type": "FeatureCollection", "features": filtered}
