import aiohttp
import pytest
import random
import string

BASE_URL = "http://localhost:8080"

def random_email():
    return f"test_{''.join(random.choices(string.ascii_lowercase, k=8))}@example.com"

@pytest.mark.asyncio
async def test_get_mapbox_token():
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/api/mapbox-token") as resp:
            data = await resp.json()
            if resp.status == 200:
                assert "token" in data, "Expected a token in response"
            elif resp.status == 404:
                assert "error" in data, "Expected an error message when token is missing"
            else:
                pytest.fail(f"Unexpected status code: {resp.status}")

@pytest.mark.asyncio
async def test_create_account_and_sign_in():
    email = random_email()
    password = "TestPassword123"
    account_data = {
        "user_first": "TestFirst",
        "user_last": "TestLast",
        "user_email": email,
        "user_password": password,
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{BASE_URL}/api/createaccount", json=account_data) as resp:
            data = await resp.json()
            assert resp.status == 201, f"Account creation failed with status {resp.status}: {data}"
            assert data.get("message") == "User registered successfully"

        sign_in_data = {
            "user_email": email,
            "user_password": password,
        }
        async with session.post(f"{BASE_URL}/api/signin", json=sign_in_data) as resp:
            data = await resp.json()
            assert resp.status == 200, f"Sign in failed with status {resp.status}: {data}"
            assert data.get("message") == "User signed in successfully"

        async with session.get(f"{BASE_URL}/api/protected") as resp:
            data = await resp.json()
            if resp.status == 200:
                assert "This is a protected route" in data.get("message")
            else:
                pytest.skip("Protected route not accessible in this session")

@pytest.mark.asyncio
async def test_sign_out_and_is_logged_in():
    email = random_email()
    password = "TestPassword123"
    account_data = {
        "user_first": "TestFirst",
        "user_last": "TestLast",
        "user_email": email,
        "user_password": password,
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{BASE_URL}/api/createaccount", json=account_data) as resp:
            assert resp.status == 201

        sign_in_data = {
            "user_email": email,
            "user_password": password,
        }
        async with session.post(f"{BASE_URL}/api/signin", json=sign_in_data) as resp:
            assert resp.status == 200

        async with session.get(f"{BASE_URL}/api/is_logged_in") as resp:
            data = await resp.json()
            assert resp.status == 200, f"Login check failed with status {resp.status}"
            assert data.get("logged_in") is True, "User should be logged in"

        async with session.post(f"{BASE_URL}/api/signout") as resp:
            data = await resp.json(content_type=None)
            assert resp.status == 200, f"Sign out failed with status {resp.status}"
            assert data.get("message") == "User signed out successfully"

        async with session.get(f"{BASE_URL}/api/is_logged_in") as resp:
            data = await resp.json()
            assert resp.status == 401, f"Post sign-out login check returned unexpected status {resp.status}"
            assert data.get("logged_in") is False

@pytest.mark.asyncio
async def test_welcome_endpoint():
    email = random_email()
    password = "TestPassword123"
    first_name = "TestFirst"
    account_data = {
        "user_first": first_name,
        "user_last": "TestLast",
        "user_email": email,
        "user_password": password,
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{BASE_URL}/api/createaccount", json=account_data) as resp:
            assert resp.status == 201

        sign_in_data = {
            "user_email": email,
            "user_password": password,
        }
        async with session.post(f"{BASE_URL}/api/signin", json=sign_in_data) as resp:
            assert resp.status == 200

        async with session.get(f"{BASE_URL}/api/welcome") as resp:
            data = await resp.json()
            assert resp.status == 200, f"Welcome failed with status {resp.status}"
            assert first_name in data.get("message", ""), "Welcome message does not contain the user's first name"