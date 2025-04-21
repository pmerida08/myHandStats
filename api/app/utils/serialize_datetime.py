from datetime import datetime

def serialize_datetime(value):
    if isinstance(value, datetime):
        return value.isoformat()
    return value
