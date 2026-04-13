import os
import json
from google import genai
from google.genai import types
from typing import Dict, Any
from shared.models import NewsArticle, NewsIntelligence


class AIService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-2.0-flash"

    def analyze_news(self, article: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Analyze the following financial news article and provide intelligence in JSON format.
        
        Headline: {article.get('headline')}
        Source: {article.get('source_name')}
        
        Respond with ONLY a valid JSON object with this exact structure:
        {{
            "sentiment_score": <float from -1.0 to 1.0>,
            "trust_score": <float from 0.0 to 100.0>,
            "category": <one of: "Macro", "Geopolitical", "Sector-Specific", "Earnings/Corporate", "Legal/Regulatory", "Innovation/Tech">,
            "rationale": {{
                "source_reputation": <string>,
                "consistency": <string>,
                "factual_grounding": <string>,
                "bias_detection": <string>
            }},
            "confidence_level": <float from 0.0 to 1.0>
        }}
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    system_instruction="You are a senior financial intelligence analyst. Return only valid JSON.",
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            # Fallback for mock/offline testing
            return {
                "sentiment_score": 0.0,
                "trust_score": 50.0,
                "category": "Macro",
                "rationale": {
                    "source_reputation": "Unknown",
                    "consistency": "Average",
                    "factual_grounding": "Moderate",
                    "bias_detection": "Neutral",
                },
                "confidence_level": 0.5,
            }
