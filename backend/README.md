# Setting Up
Create a `.env` file using `.env.example`.

# Running Quart
`pip install -r requirements.txt`
`python3 dashboard.py`

# Accessing The API
http://0.0.0.0:8080
> http://0.0.0.0:8080/users (Example)

# Access Denied
If you receive an "Access Denied" message when you visit the API, rerun the program with `sudo python3 dashboard.py`

# Running Tests
`pytest backend/src/routes/test_user_routes.py` (while docker compose is running)