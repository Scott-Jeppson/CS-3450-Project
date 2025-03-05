-- Create the database user and assign a password
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'myuser') THEN
      CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword';
   END IF;
END
$do$;

-- Create the database (if not already created)
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mydatabase') THEN
      CREATE DATABASE mydatabase;
   END IF;
END
$do$;

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