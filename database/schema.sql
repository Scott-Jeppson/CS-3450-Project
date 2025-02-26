-- Create the database user and assign a password
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Create the database (if not already created)
CREATE DATABASE mydatabase;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;

-- Switch to the created database (to create tables in the correct DB)
\c mydatabase;

CREATE TABLE user_information (
    "id" SERIAL PRIMARY KEY,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "salt" VARCHAR(255)
);