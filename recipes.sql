-- Active: 1698740960712@@147.139.210.135@5432@fau01
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    autor VARCHAR(225),
    description TEXT,
    ingredients TEXT[],
    instructions TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);


INSERT INTO recipes (title,autor, description, ingredients, instructions, created_at, updated_at)
VALUES
   ('Nama Resep 1','Penulis 1', 'Deskripsi Resep 1', ARRAY['Bahan 1', 'Bahan 2'], ARRAY['Langkah 1', 'Langkah 2'], NOW(), NULL),
   ('Nama Resep 2', 'Penulis 2', 'Deskripsi Resep 2', ARRAY['Bahan 3', 'Bahan 4'], ARRAY['Langkah 3', 'Langkah 4'], NOW(), NULL);

ALTER TABLE recipes
ALTER COLUMN ingredients TYPE TEXT;

-- Mengubah kolom instructions menjadi tipe TEXT
ALTER TABLE recipes
ALTER COLUMN instructions TYPE TEXT;



CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100)
);


DROP TABLE recipes;


CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  photo_recipes VARCHAR,
  description TEXT,
  ingredients TEXT,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INT,
  user_id VARCHAR,
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (user_id) REFERENCES users(uuid)
);


INSERT INTO category (name)
VALUES
   ('Main Course'),
   ('Appetizer'),
   ('Dessert')


SELECT * FROM recipes
    WHERE title ILIKE '%pudding%'


DELETE FROM category WHERE id = 6


SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.id
      WHERE category_id = 1

SELECT * FROM users


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  uuid VARCHAR UNIQUE  PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(225) NOT NULL
);

CREATE TABLE users(
	uuid VARCHAR UNIQUE,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	username VARCHAR 
);

SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.uuid

     SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.uuid
      WHERE user_id = 'ff1a4ba2-b40e-4f79-a6d6-1667e3e57d28'


       UPDATE users
    SET username = 'Ucup Surucup'
    WHERE uuid = '86d67c70-2368-4509-be9d-92045a303f8c'

    ALTER TABLE users ADD COLUMN photo_user VARCHAR