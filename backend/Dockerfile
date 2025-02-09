# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /backend

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the correct port
EXPOSE 5000

# Use the .env file
ENV PYTHONUNBUFFERED=1

# Set default command to run Quart
CMD ["python", "dashboard.py"]
