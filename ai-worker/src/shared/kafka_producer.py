import json
from kafka import KafkaProducer
import logging

class BaseKafkaProducer:
    def __init__(self, bootstrap_servers):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8')
        )
        self.logger = logging.getLogger(__name__)

    def send_message(self, topic, key, value):
        self.logger.info(f"Sending message to topic: {topic}")
        try:
            future = self.producer.send(topic, key=key.encode('utf-8') if isinstance(key, str) else key, value=value)
            self.producer.flush()
            return future.get(timeout=10)
        except Exception as e:
            self.logger.error(f"Error sending message: {e}")
            raise

    def close(self):
        self.producer.close()
