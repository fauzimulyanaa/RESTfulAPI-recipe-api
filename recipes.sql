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

  CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  recipes_id INT,
  user_id VARCHAR,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipes_id) REFERENCES recipes(id),
  FOREIGN KEY (user_id) REFERENCES users(uuid)
);



SELECT * FROM events

INSERT INTO events (status) VALUES ( 'like')

DROP TABLE users;

DROP TABLE users CASCADE;

CREATE TABLE category(
    "id_category" SERIAL NOT NULL,
    name varchar NOT NULL,
    PRIMARY KEY(id_category)
);

-- Insert into the category table
INSERT INTO category (name) VALUES
  ('maincourse'),
  ('appetizer'),
  ('dessert');


CREATE TABLE comments(
    "id_comment" SERIAL NOT NULL,
    "id_recipe" integer,
    "id_user" varchar,
    commentar varchar NOT NULL,
    "created_at" timestamp without time zone DEFAULT now(),
    PRIMARY KEY(id_comment)
)

CREATE TABLE event(
    id SERIAL NOT NULL,
    "recipes_id" integer,
    "users_id" varchar,
    status varchar,
    "created_at" timestamp without time zone DEFAULT now(),
    PRIMARY KEY(id),
    CONSTRAINT fk_recipes_1 FOREIGN key("recipes_id") REFERENCES recipes("id_recipe")
)

CREATE TABLE recipes (
    "id_recipe" SERIAL NOT NULL,
    photo VARCHAR,
    title VARCHAR NOT NULL,
    ingredients VARCHAR NOT NULL,
    "created_time" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_time" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "id_user" INTEGER NOT NULL,
    "id_category" INTEGER NOT NULL,
    uuid VARCHAR,
    PRIMARY KEY (id_recipe),
    CONSTRAINT fk_id_category FOREIGN KEY ("id_category") REFERENCES category("id_category"),
    CONSTRAINT fk_id_user FOREIGN KEY ("id_user") REFERENCES users("id_user"),
    CONSTRAINT fk_uuid FOREIGN KEY (uuid) REFERENCES users("uuid")
);

CREATE TABLE recipes(
    "id_recipe" SERIAL NOT NULL,
    photo varchar,
    title varchar NOT NULL,
    ingredients varchar NOT NULL,
    "created_time" timestamp with time zone DEFAULT now(),
    "updated_time" timestamp with time zone DEFAULT now(),
    "id_user" integer NOT NULL,
    "id_category" integer NOT NULL,
    uuid varchar,
    PRIMARY KEY(id_recipe),
    CONSTRAINT fk_id_category FOREIGN key("id_category") REFERENCES category("id_category"),
    CONSTRAINT fk_id_user FOREIGN key("id_user") REFERENCES users("id_user"),
    CONSTRAINT fk_uuid FOREIGN key(uuid) REFERENCES users(uuid)
);

CREATE TABLE users (
    "id_user" SERIAL NOT NULL,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    "phone_number" VARCHAR,
    photo VARCHAR DEFAULT 'https://res.cloudinary.com/dzetef1x0/image/upload/v1699583201/recipes/a28xnmhorkr3rdozlokw.jpg'::VARCHAR,
    "created_time" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_time" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level INTEGER DEFAULT 2,
    uuid VARCHAR,
    "is_active" BOOLEAN DEFAULT FALSE,
    otp INTEGER,
    PRIMARY KEY (id_user),
    CONSTRAINT unique_uuid UNIQUE (uuid)
);
