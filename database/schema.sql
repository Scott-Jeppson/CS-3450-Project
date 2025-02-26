CREATE TABLE user_information (
    "id" SERIAL PRIMARY KEY,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "salt" VARCHAR(255)
);