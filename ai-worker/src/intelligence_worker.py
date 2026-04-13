import os
import logging
from dotenv import load_dotenv
from shared.kafka_consumer import BaseKafkaConsumer
from shared.kafka_producer import BaseKafkaProducer
from services.ai_service import AIService

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IntelligenceWorker:
    def __init__(self):
        bootstrap_servers = os.getenv("KAFKA_BROKERS", "localhost:9092").split(",")
        self.consumer = BaseKafkaConsumer(bootstrap_servers, "news.raw", "intelligence-worker-group")
        self.producer = BaseKafkaProducer(bootstrap_servers)
        self.ai_service = AIService()

    def process_message(self, message):
        logger.info(f"Processing news article: {message.get('headline')}")
        
        # Analyze news
        intelligence = self.ai_service.analyze_news(message)
        
        enriched_news = {
            "article": message,
            "intelligence": intelligence,
            "category_name": intelligence.get("category"),
            "company_symbol": message.get("company_symbol") # If present
        }
        
        # Produce enriched news
        key = message.get("url")
        self.producer.send_message("news.enriched", key, enriched_news)
        logger.info(f"Successfully enriched and produced news for: {message.get('headline')}")

    def run(self):
        logger.info("Intelligence Worker started...")
        self.consumer.start_consuming(self.process_message)

if __name__ == "__main__":
    worker = IntelligenceWorker()
    worker.run()
