from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class NewsArticle(BaseModel):
    id: Optional[UUID] = None
    company_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    source_name: str
    headline: str
    content_summary: Optional[str] = None
    url: str
    published_at: datetime
    created_at: Optional[datetime] = None

class NewsIntelligence(BaseModel):
    id: Optional[UUID] = None
    news_article_id: UUID
    sentiment_score: float = Field(..., ge=-1.0, le=1.0)
    trust_score: float = Field(..., ge=0.0, le=100.0)
    rationale: Dict[str, Any]
    confidence_level: Optional[float] = Field(None, ge=0.0, le=1.0)
    model_version: str
    created_at: Optional[datetime] = None

class EnrichedNews(BaseModel):
    article: NewsArticle
    intelligence: NewsIntelligence
    category_name: Optional[str] = None
    company_symbol: Optional[str] = None
