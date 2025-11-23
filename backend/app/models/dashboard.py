from pydantic import BaseModel, Field
from typing import List


# 1. New Sub-Model for the Buttons
class FashionStyle(BaseModel):
    style_name: str = Field(
        description="Name of the style in Japanese (e.g., 'カジュアル', 'フォーマル', 'アウトドア')")
    key_item: str = Field(description="One main item to buy in Japanese (e.g., '防水ジャケット')")


class PlaceRecommendation(BaseModel):
    name: str = Field(description="Name of the tourist spot in Japanese")
    description: str = Field(description="A short, exciting description in Japanese")
    type: str = Field(description="Category: 'History', 'Food', 'Nature', or 'Shopping'")


class DashboardResponse(BaseModel):
    location: str = Field(description="The main city name in Japanese")
    weather_summary: str = Field(description="A general summary of typical weather")

    # Updated: We want a longer, detailed paragraph here
    fashion_advice: str = Field(
        description="A DETAILED, long paragraph (3-4 sentences) about what to wear in polite Japanese.")

    # New: The list of 3 buttons
    fashion_styles: List[FashionStyle] = Field(
        description="Exactly 3 distinct fashion style suggestions for this weather")

    places: List[PlaceRecommendation] = Field(description="List of 3 recommended places")
    nearby_cities: List[str] = Field(description="List of 3 nearby major cities")