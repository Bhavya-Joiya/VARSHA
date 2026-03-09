"""
VARSHA - Vulnerability Assessment & Risk Scoring for Hydrological Analysis
Score Engine: Calculates flood readiness scores for Mumbai wards
"""

import numpy as np
import random

random.seed(42)
np.random.seed(42)

# ─────────────────────────────────────────────
# MUMBAI WARD DATA
# Real ward names, real flood history, realistic parameters
# Coordinates are approximate bounding boxes (lng_min, lat_min, lng_max, lat_max)
# ─────────────────────────────────────────────

MUMBAI_WARDS = [
    {
        "id": 1,
        "name": "Dharavi",
        "district": "G/North",
        "bbox": [72.845, 19.015, 72.865, 19.035],
        "population": 850000,
        "area_sqkm": 2.4,
        "historical_floods": 10,
        "avg_elevation_m": 8,
        "drainage_pipes_km": 6,
        "drain_age_years": 45,
        "near_water_body": True,
        "water_body": "Mithi River",
        "known_hotspots": ["Dharavi Drain Junction", "Near Sion Hospital"],
    },
    {
        "id": 2,
        "name": "Mankhurd",
        "district": "M/East",
        "bbox": [72.925, 19.085, 72.945, 19.105],
        "population": 220000,
        "area_sqkm": 6.1,
        "historical_floods": 11,
        "avg_elevation_m": 5,
        "drainage_pipes_km": 5,
        "drain_age_years": 50,
        "near_water_body": True,
        "water_body": "Thane Creek",
        "known_hotspots": ["Mankhurd Station", "Near Mankhurd Bridge"],
    },
    {
        "id": 3,
        "name": "Kurla",
        "district": "L",
        "bbox": [72.875, 19.065, 72.895, 19.085],
        "population": 310000,
        "area_sqkm": 4.2,
        "historical_floods": 9,
        "avg_elevation_m": 10,
        "drainage_pipes_km": 8,
        "drain_age_years": 42,
        "near_water_body": True,
        "water_body": "Mithi River",
        "known_hotspots": ["Kurla Station", "Near LBS Marg"],
    },
    {
        "id": 4,
        "name": "Govandi",
        "district": "M/East",
        "bbox": [72.905, 19.115, 72.925, 19.135],
        "population": 195000,
        "area_sqkm": 5.8,
        "historical_floods": 10,
        "avg_elevation_m": 6,
        "drainage_pipes_km": 4,
        "drain_age_years": 48,
        "near_water_body": True,
        "water_body": "Thane Creek",
        "known_hotspots": ["Govandi Station", "Near Deonar"],
    },
    {
        "id": 5,
        "name": "Chembur",
        "district": "M/East",
        "bbox": [72.895, 19.045, 72.915, 19.065],
        "population": 280000,
        "area_sqkm": 5.2,
        "historical_floods": 6,
        "avg_elevation_m": 18,
        "drainage_pipes_km": 12,
        "drain_age_years": 35,
        "near_water_body": False,
        "water_body": None,
        "known_hotspots": ["Chembur Station", "Near Golf Club"],
    },
    {
        "id": 6,
        "name": "Vikhroli",
        "district": "L",
        "bbox": [72.935, 19.125, 72.955, 19.145],
        "population": 245000,
        "area_sqkm": 7.3,
        "historical_floods": 5,
        "avg_elevation_m": 20,
        "drainage_pipes_km": 14,
        "drain_age_years": 30,
        "near_water_body": True,
        "water_body": "Powai Lake",
        "known_hotspots": ["Vikhroli Station", "Near Eastern Express Highway"],
    },
    {
        "id": 7,
        "name": "Bhandup",
        "district": "S",
        "bbox": [72.945, 19.145, 72.965, 19.165],
        "population": 200000,
        "area_sqkm": 8.1,
        "historical_floods": 7,
        "avg_elevation_m": 15,
        "drainage_pipes_km": 10,
        "drain_age_years": 38,
        "near_water_body": True,
        "water_body": "Tulsi Lake",
        "known_hotspots": ["Bhandup Station", "Near LBS Marg"],
    },
    {
        "id": 8,
        "name": "Mulund",
        "district": "S",
        "bbox": [72.955, 19.165, 72.975, 19.185],
        "population": 225000,
        "area_sqkm": 9.2,
        "historical_floods": 4,
        "avg_elevation_m": 22,
        "drainage_pipes_km": 16,
        "drain_age_years": 25,
        "near_water_body": False,
        "water_body": None,
        "known_hotspots": ["Mulund Station", "Near Eastern Express Highway"],
    },
    {
        "id": 9,
        "name": "Ghatkopar",
        "district": "N",
        "bbox": [72.905, 19.085, 72.925, 19.105],
        "population": 290000,
        "area_sqkm": 6.4,
        "historical_floods": 7,
        "avg_elevation_m": 14,
        "drainage_pipes_km": 11,
        "drain_age_years": 36,
        "near_water_body": True,
        "water_body": "Mithi River headwaters",
        "known_hotspots": ["Ghatkopar Station", "Near Andheri-Ghatkopar Link Road"],
    },
    {
        "id": 10,
        "name": "Andheri East",
        "district": "K/E",
        "bbox": [72.865, 19.115, 72.885, 19.135],
        "population": 375000,
        "area_sqkm": 7.8,
        "historical_floods": 8,
        "avg_elevation_m": 11,
        "drainage_pipes_km": 9,
        "drain_age_years": 40,
        "near_water_body": True,
        "water_body": "Mithi River",
        "known_hotspots": ["Andheri Station", "Near MIDC"],
    },
    {
        "id": 11,
        "name": "Andheri West",
        "district": "K/W",
        "bbox": [72.825, 19.125, 72.845, 19.145],
        "population": 320000,
        "area_sqkm": 6.9,
        "historical_floods": 5,
        "avg_elevation_m": 16,
        "drainage_pipes_km": 13,
        "drain_age_years": 32,
        "near_water_body": True,
        "water_body": "Arabian Sea coast",
        "known_hotspots": ["Andheri West Station", "Near Versova"],
    },
    {
        "id": 12,
        "name": "Jogeshwari",
        "district": "K/W",
        "bbox": [72.845, 19.145, 72.865, 19.165],
        "population": 268000,
        "area_sqkm": 5.1,
        "historical_floods": 8,
        "avg_elevation_m": 9,
        "drainage_pipes_km": 7,
        "drain_age_years": 41,
        "near_water_body": True,
        "water_body": "Mahim Creek",
        "known_hotspots": ["Jogeshwari Station", "Near Western Express Highway"],
    },
    {
        "id": 13,
        "name": "Malad",
        "district": "P/N",
        "bbox": [72.815, 19.175, 72.835, 19.195],
        "population": 410000,
        "area_sqkm": 10.2,
        "historical_floods": 6,
        "avg_elevation_m": 13,
        "drainage_pipes_km": 12,
        "drain_age_years": 33,
        "near_water_body": True,
        "water_body": "Malad Creek",
        "known_hotspots": ["Malad Station", "Near Link Road"],
    },
    {
        "id": 14,
        "name": "Borivali",
        "district": "R/N",
        "bbox": [72.855, 19.215, 72.875, 19.235],
        "population": 385000,
        "area_sqkm": 11.4,
        "historical_floods": 3,
        "avg_elevation_m": 25,
        "drainage_pipes_km": 18,
        "drain_age_years": 20,
        "near_water_body": True,
        "water_body": "Sanjay Gandhi NP",
        "known_hotspots": ["Borivali Station", "Near Western Express Highway"],
    },
    {
        "id": 15,
        "name": "Kandivali",
        "district": "R/N",
        "bbox": [72.865, 19.195, 72.885, 19.215],
        "population": 360000,
        "area_sqkm": 9.8,
        "historical_floods": 4,
        "avg_elevation_m": 19,
        "drainage_pipes_km": 15,
        "drain_age_years": 28,
        "near_water_body": True,
        "water_body": "Dahisar River",
        "known_hotspots": ["Kandivali Station", "Near Link Road"],
    },
    {
        "id": 16,
        "name": "Sion",
        "district": "F/S",
        "bbox": [72.855, 19.025, 72.875, 19.045],
        "population": 185000,
        "area_sqkm": 3.2,
        "historical_floods": 9,
        "avg_elevation_m": 7,
        "drainage_pipes_km": 6,
        "drain_age_years": 44,
        "near_water_body": True,
        "water_body": "Sion Creek",
        "known_hotspots": ["Sion Station", "Near Sion Hospital"],
    },
    {
        "id": 17,
        "name": "Dadar",
        "district": "F/N",
        "bbox": [72.835, 19.015, 72.855, 19.035],
        "population": 225000,
        "area_sqkm": 3.8,
        "historical_floods": 6,
        "avg_elevation_m": 12,
        "drainage_pipes_km": 10,
        "drain_age_years": 38,
        "near_water_body": True,
        "water_body": "Arabian Sea",
        "known_hotspots": ["Dadar Station", "Near Shivaji Park"],
    },
    {
        "id": 18,
        "name": "Worli",
        "district": "F/S",
        "bbox": [72.815, 19.005, 72.835, 19.025],
        "population": 175000,
        "area_sqkm": 4.1,
        "historical_floods": 4,
        "avg_elevation_m": 15,
        "drainage_pipes_km": 14,
        "drain_age_years": 30,
        "near_water_body": True,
        "water_body": "Arabian Sea",
        "known_hotspots": ["Worli Seaface", "Near Worli Naka"],
    },
    {
        "id": 19,
        "name": "Malabar Hill",
        "district": "D",
        "bbox": [72.795, 18.965, 72.815, 18.985],
        "population": 95000,
        "area_sqkm": 3.5,
        "historical_floods": 1,
        "avg_elevation_m": 55,
        "drainage_pipes_km": 20,
        "drain_age_years": 18,
        "near_water_body": True,
        "water_body": "Arabian Sea",
        "known_hotspots": ["Malabar Hill", "Near Hanging Gardens"],
    },
    {
        "id": 20,
        "name": "Colaba",
        "district": "A",
        "bbox": [72.775, 18.905, 72.795, 18.925],
        "population": 145000,
        "area_sqkm": 4.8,
        "historical_floods": 5,
        "avg_elevation_m": 10,
        "drainage_pipes_km": 12,
        "drain_age_years": 50,
        "near_water_body": True,
        "water_body": "Arabian Sea",
        "known_hotspots": ["Colaba Station", "Near Gateway of India"],
    },
]


# ─────────────────────────────────────────────
# SCORING ALGORITHM
# 3 sub-scores → 1 overall readiness score
# Higher score = MORE VULNERABLE / LESS PREPARED
# ─────────────────────────────────────────────

def compute_flood_vulnerability_index(ward: dict) -> dict:
    """
    FVI: How likely is this ward to flood?
    Factors: elevation (low = bad), proximity to water, historical events
    Score: 0-100 (100 = most vulnerable)
    """
    # Elevation penalty (lower elevation = higher risk)
    elev = ward["avg_elevation_m"]
    if elev < 196:
        elev_score = 85
    elif elev < 200:
        elev_score = 70
    elif elev < 205:
        elev_score = 50
    elif elev < 210:
        elev_score = 30
    else:
        elev_score = 15

    # Historical flood penalty
    hist = ward["historical_floods"]
    hist_score = min(hist * 9, 90)  # max cap at 90

    # Proximity to water body
    water_score = 30 if ward["near_water_body"] else 0

    # Weighted combination
    fvi = (elev_score * 0.35) + (hist_score * 0.45) + (water_score * 0.20)
    fvi = round(min(fvi, 100), 1)

    return {
        "score": fvi,
        "elevation_component": round(elev_score, 1),
        "historical_component": round(hist_score, 1),
        "water_proximity_component": water_score,
    }


def compute_drainage_health_score(ward: dict) -> dict:
    """
    DHS: How healthy/adequate is the drainage system?
    Factors: pipe length per area, age of infrastructure
    Score: 0-100 (100 = worst drainage)
    """
    # Drainage density (km per sq km) - more = better
    density = ward["drainage_pipes_km"] / ward["area_sqkm"]
    if density >= 3.5:
        density_score = 10
    elif density >= 2.5:
        density_score = 30
    elif density >= 1.8:
        density_score = 55
    elif density >= 1.2:
        density_score = 70
    else:
        density_score = 88

    # Infrastructure age (older = worse)
    age = ward["drain_age_years"]
    if age < 10:
        age_score = 10
    elif age < 20:
        age_score = 25
    elif age < 30:
        age_score = 45
    elif age < 40:
        age_score = 65
    else:
        age_score = 82

    dhs = (density_score * 0.6) + (age_score * 0.4)
    dhs = round(min(dhs, 100), 1)

    return {
        "score": dhs,
        "density_km_per_sqkm": round(density, 2),
        "density_component": round(density_score, 1),
        "age_component": round(age_score, 1),
    }


def compute_response_readiness_index(ward: dict) -> dict:
    """
    RRI: How ready are authorities to respond?
    (For prototype: derived from population density and ward area as proxy)
    Score: 0-100 (100 = least prepared)
    """
    pop_density = ward["population"] / ward["area_sqkm"]

    # High density = harder to manage response
    if pop_density < 8000:
        density_risk = 20
    elif pop_density < 15000:
        density_risk = 40
    elif pop_density < 25000:
        density_risk = 65
    else:
        density_risk = 80

    # Add slight random noise to simulate variability in resource deployment
    rng = random.Random(ward["id"] * 7)
    noise = rng.randint(-8, 8)
    rri = round(max(10, min(90, density_risk + noise)), 1)

    return {
        "score": rri,
        "population_density": round(pop_density, 0),
        "density_risk_component": density_risk,
    }


def generate_recommendations(ward: dict, fvi: float, dhs: float, overall: float) -> list:
    """Generates specific, actionable pre-monsoon recommendations"""
    recs = []

    if fvi >= 70:
        recs.append(f"🔴 Deploy minimum 3 mobile pumps to {ward['known_hotspots'][0]} before June 1")
    elif fvi >= 50:
        recs.append(f"🟠 Pre-position 2 mobile pumps near {ward['known_hotspots'][0]}")

    if dhs >= 65:
        recs.append(f"🔴 Urgent desilting required on all {ward['drainage_pipes_km']} km of drain network")
    elif dhs >= 40:
        recs.append(f"🟠 Schedule drain inspection & partial desilting before May 15")

    if ward["near_water_body"]:
        recs.append(f"⚠️ Monitor {ward['water_body']} water level daily from May 20; activate flood alert at 3m rise")

    if overall >= 65:
        recs.append(f"📢 Issue pre-monsoon advisory to {ward['population']:,} residents of {ward['name']}")
        recs.append("🏥 Coordinate with nearest hospital for flood emergency plan")

    if ward["drain_age_years"] >= 35:
        recs.append(f"🔧 Infrastructure alert: drain pipes are {ward['drain_age_years']} years old — inspect for structural weakness")

    if not recs:
        recs.append("✅ Maintain current drainage system; standard pre-monsoon checks sufficient")

    return recs


def get_risk_level(score: float) -> str:
    if score >= 70:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 30:
        return "MODERATE"
    else:
        return "LOW"


def get_risk_color(score: float) -> str:
    if score >= 70:
        return "#dc2626"   # red
    elif score >= 50:
        return "#ea580c"   # orange
    elif score >= 30:
        return "#ca8a04"   # yellow
    else:
        return "#16a34a"   # green


def build_ward_polygon(bbox: list) -> list:
    """Converts [lng_min, lat_min, lng_max, lat_max] to GeoJSON polygon ring"""
    lng_min, lat_min, lng_max, lat_max = bbox

    # Add slight irregular jitter so wards don't look like perfect boxes
    rng = random.Random(lng_min * 1000)
    jitter = lambda: rng.uniform(-0.002, 0.002)

    return [[
        [lng_min + jitter(), lat_min + jitter()],
        [lng_max + jitter(), lat_min + jitter()],
        [lng_max + jitter(), lat_max + jitter()],
        [lng_min + jitter(), lat_max + jitter()],
        [lng_min + jitter(), lat_min + jitter()],  # close the ring
    ]]


def calculate_all_ward_scores() -> dict:
    """
    Master function: calculates all scores for all wards.
    Returns a GeoJSON FeatureCollection ready to serve from the API.
    """
    features = []

    for ward in MUMBAI_WARDS:
        fvi_data = compute_flood_vulnerability_index(ward)
        dhs_data = compute_drainage_health_score(ward)
        rri_data = compute_response_readiness_index(ward)

        # Weighted overall score (FVI and DHS are heavier)
        overall = round(
            fvi_data["score"] * 0.45 +
            dhs_data["score"] * 0.35 +
            rri_data["score"] * 0.20,
            1
        )

        recommendations = generate_recommendations(ward, fvi_data["score"], dhs_data["score"], overall)

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": build_ward_polygon(ward["bbox"])
            },
            "properties": {
                "id": ward["id"],
                "name": ward["name"],
                "district": ward["district"],
                "population": ward["population"],
                "area_sqkm": ward["area_sqkm"],
                "near_water_body": ward["near_water_body"],
                "water_body": ward["water_body"],
                "known_hotspots": ward["known_hotspots"],
                "historical_floods": ward["historical_floods"],

                # Scores
                "overall_score": overall,
                "risk_level": get_risk_level(overall),
                "risk_color": get_risk_color(overall),

                "fvi": fvi_data["score"],
                "fvi_detail": fvi_data,

                "dhs": dhs_data["score"],
                "dhs_detail": dhs_data,

                "rri": rri_data["score"],
                "rri_detail": rri_data,

                "recommendations": recommendations,
            }
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features
    }


def get_city_summary(geojson: dict) -> dict:
    """Returns an aggregated city-level readiness summary"""
    props = [f["properties"] for f in geojson["features"]]
    scores = [p["overall_score"] for p in props]

    critical = sum(1 for p in props if p["risk_level"] == "CRITICAL")
    high = sum(1 for p in props if p["risk_level"] == "HIGH")
    moderate = sum(1 for p in props if p["risk_level"] == "MODERATE")
    low = sum(1 for p in props if p["risk_level"] == "LOW")

    avg_score = round(np.mean(scores), 1)
    total_pop_at_risk = sum(
        p["population"] for p in props if p["risk_level"] in ["CRITICAL", "HIGH"]
    )

    return {
        "city": "Mumbai",
        "total_wards": len(props),
        "avg_readiness_score": avg_score,
        "overall_risk_level": get_risk_level(avg_score),
        "wards_by_risk": {
            "critical": critical,
            "high": high,
            "moderate": moderate,
            "low": low,
        },
        "population_at_risk": total_pop_at_risk,
        "last_updated": "2026-03-06T09:00:00Z",
    }
