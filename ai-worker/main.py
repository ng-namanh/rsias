import time
import logging
from src.shared.kafka_consumer import BaseKafkaConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AI-Worker")

def process_news(message_value):
    """
    Placeholder for Phase 4 (Sentiment Analysis)
    """
    logger.info(f"AI Worker Processing News: {message_value.get('headline')}")
    # In Phase 4, we will add NER and Sentiment logic here.

def main():
    logger.info("RSIAS AI Worker starting...")
    
    # We point to the Kafka broker we set up in docker-compose
    # and the topic from User Story 1
    consumer = BaseKafkaConsumer(
        bootstrap_servers=['localhost:9092'],
        topic='news.ingested',
        group_id='ai-sentiment-analyzer'
    )

    try:
        # This is a blocking loop - it stays alive!
        consumer.start_consuming(process_news)
    except KeyboardInterrupt:
        logger.info("AI Worker shutting down gracefully...")
    finally:
        consumer.close()

if __name__ == "__main__":
    main()
