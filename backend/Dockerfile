FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt

COPY backend/ .

WORKDIR /app/src

EXPOSE 8081

ENV PYTHONUNBUFFERED=1

CMD ["python", "dashboard.py"]