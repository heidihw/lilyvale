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
  quantity INTEGER,
  src TEXT
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
  "Haikyu!! Shoyo Hinata Crow 5 Inch Plush", 8, 0, "plush haikyuu n10-20",
  "Officially licensed Shoyo Hinata Plush! 100% polyester", 5,
  "haikyuu-shoyo-hinata-crow-plush.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Haikyu!! - Nishinoya Keychain", 4, 0, "keychain haikyuu n10-20",
  "Officially licensed Nishinoya Keychain! Made out of PVC.", 5,
  "haikyuu-nishinoya-keychain.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Haikyu!! - Kageyama Crow 5 Inch Plush", 13, 0, "keychain haikyuu n10-20",
  "Officially licensed Tobio Kageyama Plush! 100% polyester", 5,
  "haikyuu-kageyama-plush.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Haikyu!! - Toru Oikawa Lookup Figure", 30, 0, "figurine haikyuu n20-n",
  "Look up figurine by Megahouse. It is approx. 4.3 inches tall and made out of PVC.", 5,
  "haikyuu-tooru-oikawa-lookup-figure.jpeg"
);
-- first batch
INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Haikyu!! - Kei Tsukishima Nendoroid Pin", 15, 0, "pin haikyuu n10-20",
  "Who's ready to capture the spirit of teamwork, determination, and the thrill
  of volleyball? Kei Tsukishima, the starting middle blocker of Haikyu!!, is now
  a Nendoroid Pin. Now, you can block metaphorical volleys by wearing or displaying
  Kei as part of your anime collection. It is officially licensed and approx. 2 inches tall.
  Manufacturer is Good Smile Company.", 5, "haikyuu-tsukishima-kei-pin.png"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "JUJUTSU KAISEN - Suguru Geto Nendoroid (Tokyo Jujutsu High School Ver.)", 50, 0,
  "figurine jujutsu-kaisen n20-n", "From the anime series “Jujutsu Kaisen Hidden
  Inventory / Premature Death” comes a Rerelease of the Nendoroid of Suguru Geto from when he
  attended Tokyo Jujutsu High School! It comes with confident, angry, and goading face plates
  as well as Okinawa soba and a cell phone for additional parts!", 10,
  "jjk-high-school-geto-suguru-nendoroid.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Jujutsu Kaisen - Nobara Kugisaki Sitting Casual 7 Inch Plush", 23, 0,
  "plush jujutsu-kaisen n20-n", "Officially licensed Nobara Kugisaki plush! It is approx. 7 inches
  and made 100% out of polyester.", 5, "jjk-nobara-kugisaki-casual-plush.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Jujutsu Kaisen Season 1 Part 2 Blu-ray", 41, 0, "dvd jujutsu-kaisen n20-n",
  "Jujutsu Kaisen Season 1 Part 2 Blu-ray contains episodes 13-24 of the anime directed by
  Sung Hoo Park. Jujutsu High is about to host its Kyoto Sister School Exchange Event—an
  annual competition of Tokyo and Kyoto Jujutsu High campuses. Fushiguro, Kugisaki,
  and second-years Maki, Toge, and Panda meet up to greet Todo and the other Kyoto
  students on arrival. Sparks immediately start to fly when Gojo rushes in late to the meetup.",
  4, "jjk-season-one-pt-two-bluray.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Jujutsu Kaisen 0 The Movie Lenticular Cover Edition Blu-ray/DVD", 30, 0,
  "dvd jujutsu-kaisen n20-n",
  "When an accident takes the life of Yuta's childhood friend,he's left with her cursed spirit.
  As she harms the people near him, a depressed Yuta must choose between execution or the
  Jujutsu sorcerers. Can the curse of love turn into his greatest gift?", 5,
  "jjk-zero-bluray.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "JUJUTSU KAISEN - Kento Nanami Laydown 6 Inch Plush", 42, 0, "plush jujutsu-kaisen n20-n",
  "NESOBERI (Lay-Down) Jujutsu Kaisen Plush Kento Nanami (S) from SEGA!", 7,
  "jujutsu-kaisen-kento-nanami-plush.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Jujutsu Kaisen Manga Volume 1", 10, 0, "book jujutsu-kaisen n10-20",
  "Jujutsu Kaisen manga volume 1 features story and art by Gege Akutami. Yuji Itadori is resolved
  to save the world from cursed demons, but he soon learns that the best way to do it is
  to slowly lose his humanity and become one himself!", 3, "jujutsu-kaisen-volume-one.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Jujutsu Kaisen Manga Volume 2", 9, 0, "book jujutsu-kaisen n10-20",
  "Jujutsu Kaisen manga volume 2 features story and art by Gege Akutami. A cursed womb
  mysteriously appears at a detention facility. Itadori and his classmates are
  dispatched to the scene, but they're in for quite the surprise when they're attacked
  by a special-grade curse! Itadori allows Sukuna to take over his body in order to survive,
  but the consequences are more drastic than anyone expected!", 10,
  "jujutsu-kaisen-volume-two.jpeg"
);
-- second batch
INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Re:Zero - Rem 1/7 Scale Figure (Egg Art Ver.)", 200, 0, "figurine re-zero n20-n",
  "From the TV anime 'Re:ZERO Starting Life in Another World', Rem is made into a 1/7 scale
  figure while sitting on the egg art of an F:NEX original design! Rem smiles gently and is seen
  wearing a luxurious dress adorned with beautiful white and blue flowers. The fluffy skirt
  uses transparent parts to create a visual lightness! The contents of the egg shell are
  colored and decorated with golds and pearls to bring out the loving blue we all know Rem
  for. The lovely studded flowers are decorated in pale blue and white with the image of REM,
  and together with the gorgeous pearls worn, it is a figure full of charm from any angle.", 5,
  "rezero-rem-figurine-egg-version.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Rem Re:ZERO Figuarts Mini Figure", 22, 0, "figurine re-zero n20-n",
  "Your favorite characters, stylized and squashed into a fun to collect palm size!
  Featuring lifelike eyes and simple posability, Figuarts mini is a spin-off of the
  TAMASHII NATIONS Figuarts brand. Now Roswaal's maid REM, twin sister of Ram from
  'Re:ZERO -Starting Life in Another World' joins the popular series! Tamashii Nations is
  the manufacturer", 7, "rezero-rem-figurarts-figurine.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Re:Zero - Rem 8 Inch Plush", 19, 0, "plush re-zero n10-20",
  "Officially licensed Rem doll from Re:Zero! Made 100% out of polyester.", 10,
  "rezero-rem-plush.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Re:ZERO - Starting Life in Another World - Season 1 - Blu-ray", 50, 0, "dvd re-zero n20-n",
  "When Natsuki Subaru is transported to another world, he discovers a terrible ability:
  he can't die. Instead, he experiences the pain of death and resets which begins to destroy
  his mind. But with new friends and a new love, Subaru will suffer to save.
  Released June 9, 2020", 3, "rezero-season-one-bluray.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Pretty Guardian Sailor Moon - Artemis Paldolce Collection Figure", 16, 0,
  "figurine sailor-moon n10-20", "Made out of PVC and ABS. Manufactured by Banpresto.", 7,
  "sailor-moon-artemis-collection-figure.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Pretty Guardian Sailor Moon - Luna Paldolce Collection Figure", 16, 0,
  "figurine sailor-moon n10-20", "Made out of PVC and ABS. Manufactured by Banpresto.", 7,
  "sailor-moon-luna-collection-figure.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Pretty Guardian Sailor Moon - Diana Paldolce Collection Figure", 16, 0,
  "figurine sailor-moon n10-20", "Made out of PVC and ABS. Manufactured by Banpresto.", 7,
  "sailor-moon-diana-collection-figure.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Sailor Moon - Moon Stick Enamel Pin", 10, 0, "pin sailor-moon n10-20",
  "Officially licensed Sailor Moon Moon Stick pin! Size is about 1.9 x 0.7 inches.
  Made out of metal.", 10, "sailor-moon-moon-stick-pin.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora! Set 1 Blu-ray", 30, 0, "dvd toradora n20-n", "Toradora! Set 1 contains episodes
  1-13 of the anime directed by Tatsuyuki Nagai. Ryuji Takasu is cursed with his father's
  threatening face and is labeled a 'delinquent' because of it. Even though this makes
  it difficult for him to meet people, he is madly in love with Minorin, the one girl who
  does not flee from him in terror.", 3, "toradora-set-one-bluray.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora! - Taiga Aisaka Figure (White Kimono Ver.)", 300, 0, "figurine toradora n20-n",
  "Taiga Aisaka from Toradora! has been turned into a figure clad in a white kimono! The
  TV anime series based on Dengeki Bunko's popular novel Toradora! celebrates its 15th
  anniversary, and an illustration drawn by its character designer Masayoshi Tanaka has
  been turned into a figure. Although the white kimono may seem to have a simple design,
  it is a must-have item for fans as the details in the kimono and hair ornaments, eye-catching
  features, and size capture Taiga's liveliness. It also comes with an attachable/detachable
  cotton hat part and a palm-sized tiger for the figure! Be sure to add her to your collection!",
  10, "toradora-taiga-figurine.jpeg"
);
-- last batch
INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Toradora! Manga Volume 1", 11, 0, "book toradora n10-20",
  "Toradora! 1 features story by Yuyuko Takemiya and art by Zekkyo. Ryuji Takasu has
  learned the hard way that appearances can be deceiving. Despite his inwardly sweet
  personality, his unintentionally sharp gaze and aggressive features give him the air
  of a delinquent thug, putting his chances at making new friends, let alone a girlfriend,
  next to zero. It's Ryuji's first day in high school and it seems as if things are looking
  up. He gets to sit in between his only friend, Yusaku, and more importantly, the girl
  he's secretly crushing on, Minori Kushieda. But just when he thinks the stars are
  aligned in his favor, he unwittingly crosses the most feared girl in school, Taiga Aisaka,
  making her his arch enemy. To top it off, Taiga has moved in right next door to Ryuji
  and happens to be Minori's best friend! Can this school year possibly get any worse?!", 5,
  "toradora-volume-one-manga.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "Heaven Official's Blessing - Xie Lian Nendoroid Doll", 90, 0,
  "figurine heaven-officials-blessing n20-n", "From 'Heaven Official's Blessing', the popular bilibili
  animated series based on a novel of the same name by Mo Xiang Tong Xiu, comes a rerelease of
  the Nendoroid Doll of Xie Lian! The Nendoroid Doll series of palm-sized action figures feature
  the same heads as standard Nendoroids, but alternate doll-like bodies that are highly
  articulated and can easily be dressed-up into different outfits! Be sure to display
  him with Nendoroid Doll Hua Cheng (sold separately), also available for preorder from
  the same time! Be sure to add him to your collection!", 3, "xie-lian-nendoroid.jpeg"
);

INSERT INTO items(name, price, rating, tags, desc, quantity) VALUES (
  "JUJUTSU KAISEN - Satoru Gojo Nendoroid (Suit Ver.)", 44, 0, "figurine jujutsu-kaisen n20-n",
  "Out of Control! One of the Nendoroid lineup's most famous duos is here in suits! From
  the anime 'Jujutsu Kaisen' comes a Nendoroid of Satoru Gojo in a suit!", 6,
  "gojo-nendoroid.jpeg"
);

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




-- drop tables for if needing to restart

DROP TABLE tags;
DROP TABLE reviews;
DROP TABLE purchases;
DROP TABLE users;
DROP TABLE items;
