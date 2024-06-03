/**
 * Name:    Heidi Wang
 * Date:    2024 06 02 Sun
 * Section: CSE 154 AG, Allison and Marina
 *
 * This is the index.html for all pages of the anime shopping site.
 */

'use strict';

const express = require('express');
const app = express();

const multer = require('multer');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware

// for application/json
app.use(express.json()); // built-in middleware

// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the 'multer' module

/**
 * Heidi Wang
 * Endpoint 1: Get item information
 * Gets information for the relevant items. Returns an array of information for each item.
 * If no query parameters are included, returns information for all the items.
 * If search query parameters are included, returns information for those items that match the
 * search criteria.
 * query parameters: search order
 */
app.get('/items', async function(req, res) {
  try {
    let search = req.query.search;
    let order = req.query.order;
    let db = await getDBConnection();
    let query = buildQueryItems(search, order);
    let data;
    if (search) {
      data = await db.all(query, ['%' + search + '%']);
    } else {
      data = await db.all(query);
    }
    await db.close();
    res.type('json').send(data);
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Helper function for Endpoint 1 items
 * Builds a query to get items from the database.
 * @param {string} search - the search to use in the database query.
 * @param {string} order - the order to use in the database query.
 * @returns {string} - the query that was built.
 */
function buildQueryItems(search, order) {
  let query = 'SELECT * FROM items WHERE';
  if (search) {
    query += ' name LIKE $search OR desc LIKE $search OR tags LIKE $search AND';
  }
  query += ' quantity > 0';
  if (order === 'price') {
    query += ' ORDER BY price';
  } else if (order === 'name') {
    query += ' ORDER BY name';
  } else if (order === 'rating') {
    query += ' ORDER BY rating';
  }
  query += ';';
  return query;
}

/**
 * Heidi Wang
 * Endpoint 2: Get detailed information on an item
 * Gets detailed information on an individual item. Returns the info and reviews for the item.
 */
app.get('/items/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let db = await getDBConnection();
    let data1 = await dbSelectItemWithId(id);
    if (data1) {
      let data2 = await db.get('SELECT * FROM reviews WHERE id = ?;', [id]);
      res.type('json').send([data1, data2]);
    } else {
      await db.close();
      res.type('text').status(400)
        .send('Item does not exist.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Endpoint 3: Login with credentials
 * Logs in to a user. Returns a confirmation message.
 * POST parameters: username, password
 */
app.post('/login', async function(req, res) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      let db = await getDBConnection();
      let query = 'SELECT * FROM users WHERE username = ? AND password = ?;';
      let data = await db.get(query, [username, password]);
      await db.close();
      if (data) {
        res.cookie('uid', data['uid']);
        res.type('text').send('Logged in.');
      } else {
        res.type('text').status(400)
          .send('Invalid username or password.');
      }
    } else {
      res.type('text').status(400)
        .send('Missing required params.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Endpoint 4: Make a transaction
 * Makes a transaction. Returns the information for the transaction.
 * POST parameters: id
 */
app.post('/purchase', async function(req, res) {
  try {
    if (req.body.id) {
      if (req.cookies['uid']) {
        let data1 = await dbSelectItemWithId(req.body.id);
        if (data1) {
          if (data1['quantity'] > 0) {
            let data4 = await purchaseItem(req.body.id, req.cookies['uid']);
            res.type('json').send(data4);
          } else {
            res.type('text').status(400)
              .send('Item out of stock.');
          }
        } else {
          res.type('text').status(400)
            .send('Item does not exist.');
        }
      } else {
        res.type('text').status(400)
          .send('User not logged in.');
      }
    } else {
      res.type('text').status(400)
        .send('Missing required params.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Helper function for multiple endpoints, originally for Endpoint 4 purchase
 * Selects the item with the given item id.
 * @param {int} id - the id to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function dbSelectItemWithId(id) {
  let db = await getDBConnection();
  let data1 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
  await db.close();
  return data1;
}

/**
 * Heidi Wang
 * Helper function for Endpoint 4 purchase
 * Updates the quantity of available stock for the item with the given item id.
 * Inserts a new purchase with the given item id and the user id of the current user.
 * Selects the purchase with the item id from the insertion to return it.
 * @param {int} id - the id to use in the database query.
 * @param {string} uid - the uid to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function purchaseItem(id, uid) {
  let db = await getDBConnection();
  await db.exec('UPDATE items SET quantity = quantity - 1 WHERE id = ?;', [id]); // query2
  let query3 = 'INSERT INTO purchases(id, uid) VALUES (?, ?);';
  let data3 = await db.run(query3, [id, uid]);
  let data4 = await db.get('SELECT * FROM purchases WHERE pid = ?;', [data3.lastID]);
  await db.close();
  return data4;
}

/**
 * Heidi Wang
 * Endpoint 5: Get transaction history
 * Gets information for all items in the transaction history for the user.
 * Returns an array of information for each transaction.
 */
app.get('/history', async function(req, res) {
  try {
    if (req.cookies['uid']) {
      let db = await getDBConnection();
      let data1 = await db.all('SELECT * FROM purchases WHERE uid = ?;', [req.cookies['uid']]);
      let items = [];
      for (let i = 0; i < data1.length; i++) {
        let id = data1[i]['id'];
        let data2 = await dbSelectItemWithId(id);
        items.push(data2);
      }
      let history = [data1, items];
      await db.close();
      res.type('json').send(history);
    } else {
      res.type('text').status(400)
        .send('User not logged in.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Endpoint 6: Give feedback
 * Writes a new review. Returns the information for the posted review.
 * POST parameters: title, rating, description
 */
app.post('/feedback', async function(req, res) {
  try {
    let id = req.body.id;
    let title = req.body.title;
    let rating = req.body.rating;
    let description = req.body.description;
    let uid = req.cookies['uid'];
    if (id && title && rating && description) {
      if (uid) {
        if (await dbSelectItemWithId(id)) {
          let data2 = await dbSelectPurchaseWithIdUid(id, uid);
          if (data2) {
            if (!await dbSelectReviewWithPid(data2['pid'])) {
              let data9 = await addReview(id, uid, data2['pid'], title, rating, description);
              res.type('json').send(data9);
            } else {
              res.type('text').status(400)
                .send('User has already reviewed this item.');
            }
          } else {
            res.type('text').status(400)
              .send('User has not purchased this item before.');
          }
        } else {
          res.type('text').status(400)
            .send('Item does not exist.');
        }
      } else {
        res.type('text').status(400)
          .send('User not logged in.');
      }
    } else {
      res.type('text').status(400)
        .send('Missing required params.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Helper function for Endpoint 6 feedback
 * Selects the purchase with the given item id and the user id of the current user.
 * @param {int} id - the id to use in the database query.
 * @param {int} uid - the uid to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function dbSelectPurchaseWithIdUid(id, uid) {
  let db = await getDBConnection();
  let data2 = await db.get('SELECT * FROM purchases WHERE id = ? AND uid = ?;', [id, uid]);
  await db.close();
  return data2;
}

/**
 * Heidi Wang
 * Helper function for Endpoint 6 feedback
 * Selects the review with the given purchase id.
 * @param {int} pid - the pid to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function dbSelectReviewWithPid(pid) {
  let db = await getDBConnection();
  let data3 = await db.get('SELECT * FROM reviews WHERE pid = ?;', [pid]);
  await db.close();
  return data3;
}

/**
 * Heidi Wang
 * Helper function for Endpoint 6 feedback
 * Inserts a new review with the given data.
 * Updates the overall rating for the item with the given item id.
 * Selects the review with the item id from the insertion to return it.
 * @param {int} id - the id to use in the database query.
 * @param {int} uid - the uid to use in the database query.
 * @param {int} pid - the id of the purchase resulting from the query in the parent function.
 * @param {string} title - the title to use in the database query.
 * @param {int} rating - the rating to use in the database query.
 * @param {string} desc - the desc to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function addReview(id, uid, pid, title, rating, desc) {
  let db = await getDBConnection();
  let query4 = 'INSERT INTO reviews(id, uid, pid, title, rating, desc)';
  query4 += 'VALUES (?, ?, ?, ?, ?, ?);';
  let data4 = await db.run(query4, [id, uid, pid, title, rating, desc]);

  let data5 = await db.all('SELECT * FROM reviews WHERE id = ?;', [id]);
  let data6 = await dbSelectItemWithId(id);
  let query7 = 'UPDATE items SET rating = ? WHERE id = ?;';
  if (data6['rating']) {
    let overall = (data6['rating'] * (data5.length - 1) + rating) / data5.length;
    await db.exec(query7, [overall, id]); // query8
  } else {
    await db.exec(query7, [rating, id]); // query8
  }

  let data9 = await db.get('SELECT * FROM reviews WHERE rid = ?;', [data4.lastID]);
  await db.close();
  return data9;
}

/**
 * Heidi Wang
 * Endpoint 7: Create a user
 * Creates a new user. Returns a confirmation message.
 * POST parameters: username, password, email
 */
app.post('/create-user', async function(req, res) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    if (username && password && email) {
      let data1 = await dbSelectUserWithUsername(username);
      if (!data1) {
        let data2 = await dbSelectUserWithEmail(email);
        if (!data2) {
          await dbInsertUser(username, password, email);
          res.type('text').send('User successfully created.');
        } else {
          res.type('text').status(400)
            .send('Email already in use.');
        }
      } else {
        res.type('text').status(400)
          .send('User already exists.');
      }
    } else {
      res.type('text').status(400)
        .send('Missing required params.');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
});

/**
 * Heidi Wang
 * Helper function for Endpoint 7 create-user
 * Selects the user with the given username.
 * @param {string} username - the username to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function dbSelectUserWithUsername(username) {
  let db = await getDBConnection();
  let data1 = await db.get('SELECT * FROM users WHERE username = ?;', [username]);
  await db.close();
  return data1;
}

/**
 * Heidi Wang
 * Helper function for Endpoint 7 create-user
 * Selects the user with the given email.
 * @param {string} email - the email to use in the database query.
 * @returns {JSON} - the result of the database query.
 */
async function dbSelectUserWithEmail(email) {
  let db = await getDBConnection();
  let data2 = await db.get('SELECT * FROM users WHERE email = ?;', [email]);
  await db.close();
  return data2;
}

/**
 * Heidi Wang
 * Helper function for Endpoint 7 create-user
 * Inserts a new user with the given data.
 * @param {string} username - the username to use in the database query.
 * @param {string} password - the password to use in the database query.
 * @param {string} email - the email to use in the database query.
 */
async function dbInsertUser(username, password, email) {
  let db = await getDBConnection();
  let query3 = 'INSERT INTO users(username, password, email) VALUES (?, ?, ?);';
  await db.run(query3, [username, password, email]); // query4
  await db.close();
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'data/app.db',
    driver: sqlite3.Database
  });
  return db;
}

// tells the code to serve static files in a directory called 'public'
app.use(express.static('public'));

// specify the port to listen on
const PORT = process.env.PORT || 8000;

// tells the application to run on the specified port
app.listen(PORT);
