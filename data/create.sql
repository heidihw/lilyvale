-- Heidi Wang
-- CSE 154 AG
-- 2024 05 30

-- CREATE TABLE and INSERT INTO statements to initialize the database.

CREATE TABLE items (
  id INT PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INT,
  rating FLOAT,
  tags TEXT,
  desc TEXT,
  quantity INT
);

CREATE TABLE users (
  uid INT PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  email TEXT
);

CREATE TABLE reviews (
  rid INT PRIMARY KEY AUTOINCREMENT,
  id INT REFERENCES items(id),
  uid INT REFERENCES users(uid),
  title TEXT,
  rating INT,
  desc TEXT
);

CREATE TABLE purchases (
  pid INT PRIMARY KEY AUTOINCREMENT,
  id INT REFERENCES items(id),
  uid INT REFERENCES users(uid),
  time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (

-- );
-- INSERT INTO users(username, password, email) VALUES (

-- );
-- INSERT INTO reviews(id, uid, title, rating, desc) VALUES (

-- );
-- INSERT INTO purchases(id, uid, time) VALUES (

-- );
