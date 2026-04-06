import json
from kafka import KafkaConsumer
import logging

class BaseKafkaConsumer:
    def __init__(self, bootstrap_servers, topic, group_id):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='earliest'
        )
        self.logger = logging.getLogger(__name__)

    def start_consuming(self, message_handler):
        self.logger.info(f"Starting consumer for topic: {self.consumer.subscription()}")
        for message in self.consumer:
            self.logger.debug(f"Received message: {message.value}")
            try:
                message_handler(message.value)
            except Exception as e:
                self.logger.error(f"Error handling message: {e}")

    def close(self):
        self.consumer.close()
