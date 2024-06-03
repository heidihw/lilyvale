-- Name:    Heidi Wang
-- Date:    2024 06 02 Sun
-- Section: CSE 154 AG, Allison and Marina

-- CREATE TABLE and INSERT statements to initialize the database.

-- CREATE TABLE

CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INTEGER,
  rating FLOAT,
  tags TEXT,
  desc TEXT,
  quantity INTEGER
);

CREATE TABLE users (
  uid INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  email TEXT
);

CREATE TABLE purchases (
  pid INTEGER PRIMARY KEY AUTOINCREMENT,
  id INTEGER REFERENCES items(id),
  uid INTEGER REFERENCES users(uid),
  time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  rid INTEGER PRIMARY KEY AUTOINCREMENT,
  id INTEGER REFERENCES items(id),
  uid INTEGER REFERENCES users(uid),
  pid INTEGER REFERENCES purchases(pid),
  title TEXT,
  rating INTEGER,
  desc TEXT
);


-- INSERT INTO

-- TODO Daria: make INSERT statements to replace placeholder data with real data
-- TODO Daria: rename image files with the name of the item


INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora Taiga Plush", 25, 5, "plush toradora n20-n",
  "Toradora plushie released by ANIPLEX!", 3);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Re:Zero Emilia Pin", 10, 5, "pin re-zero n10-20",
  "Toradora plushie released by ANIPLEX!", 0);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora Taiga Keychain", 10, 5, "keychain toradora n10-20",
  "Toradora plushie released by ANIPLEX!", 1);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora Taiga Standee", 15, 5, "standee toradora n10-20",
  "Toradora plushie released by ANIPLEX!", 3);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Fate/Stay Night Saber Poster", 20, 5, "poster fate-stay-night n20-n",
  "Toradora plushie released by ANIPLEX!", 2);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "JUJUTSU KAISEN - Satoru Gojo Nendoroid (Suit Ver.)", 45, 5,
  "nendoroid jujutsu-kaisen n20-n",
  "Lorem ipsum dolor sit amet.", 3);



INSERT INTO users(username, password, email) VALUES ('john', 'abc123', 'example@email.com');
INSERT INTO users(username, password, email) VALUES ('jill', 'def456', 'example2@email.com');



INSERT INTO purchases(id, uid, time) VALUES (1, 1, '2024-03-12 16:39:02');
INSERT INTO purchases(id, uid, time) VALUES (2, 1, '2024-03-12 18:23:47');
INSERT INTO purchases(id, uid, time) VALUES (6, 1, '2024-03-13 20:00:00');
INSERT INTO purchases(id, uid, time) VALUES (6, 2, '2024-03-14 20:00:00');



INSERT INTO reviews(id, uid, pid, title, rating, desc)
VALUES (1, 1, 1, "Cool!", 5, "Omg! I love itttt!");

INSERT INTO reviews(id, uid, pid, title, rating, desc)
VALUES (6, 1, 3, "Cool!", 5, "Omg! I love itttt!");

INSERT INTO reviews(id, uid, pid, title, rating, desc)
VALUES (6, 2, 4, "Woahhhhh", 5, "This nendoroid is so adorable! I'm so glad I bought it");






-- internal use only

CREATE TABLE tags (
  tid TEXT PRIMARY KEY,
  tname TEXT,
  category TEXT
);

INSERT INTO tags VALUES('plush', 'Plush', 'type');
INSERT INTO tags VALUES('pin', 'Pin', 'type');
INSERT INTO tags VALUES('keychain', 'Keychain', 'type');
INSERT INTO tags VALUES('poster', 'Poster', 'type');
INSERT INTO tags VALUES('standee', 'Standee', 'type');
INSERT INTO tags VALUES('toradora', 'Toradora', 'franchise');
INSERT INTO tags VALUES('re-zero', 'Re:Zero', 'franchise');
INSERT INTO tags VALUES('fate-stay-night', 'Fate/Stay Night', 'franchise');
INSERT INTO tags VALUES('n0-10', 'Under $10', 'price');
INSERT INTO tags VALUES('n10-20', '$10 to $20', 'price');
INSERT INTO tags VALUES('n20-n', 'Over $20', 'price');





-- drop tables for if needing to restart

DROP TABLE tags;
DROP TABLE reviews;
DROP TABLE purchases;
DROP TABLE users;
DROP TABLE items;
