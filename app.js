/**
 * Name:    Daria Manguling, Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG, Allison and Marina
 *
 * This is the index.html for all pages of the anime shopping site.
 */

'use strict';

let currUser;

const express = require('express');
const app = express();

const multer = require('multer');

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

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
 * Builds a query to get items from the database.
 * @param {string} search - the search query parameter provided with the API call.
 * @param {string} order - the order query parameter provided with the API call.
 * @returns {string} the query that was built.
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
 * Endpoint 2: Login with credentials
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
      let data = await db.all(query, [username, password]);
      await db.close();
      if (data.length === 1) {
        currUser = data[0]['uid'];
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
 * TODO
 * Daria Manguling
 * Endpoint 3: Get detailed information on an item
 */
app.get('/item/:id', async function(req, res) {
  let id = req.params.id;
});

/**
 * Heidi Wang
 * Endpoint 4: Make a transaction
 * Makes a transaction. Returns the information for the transaction.
 * POST parameters: id
 */
app.post('/purchase', async function(req, res) {
  try {
    let id = req.body.id;
    if (id) {
      if (currUser) {
        let db = await getDBConnection();
        let data1 = await db.all('SELECT * FROM items WHERE id = ?', [id]);
        if (data1.length === 1) {
          if (data1[0]['quantity'] > 0) {
            await db.exec('UPDATE items SET quantity = quantity - 1 WHERE id = ?;', [id]);
            let query3 = 'INSERT INTO purchases(id, uid) VALUES (?, ?);';
            let data3 = await db.exec(query3, [id, currUser]);
            await db.close();
            res.type('json').send(data3);
          } else {
            await db.close();
            res.type('text').status(400)
              .send('Item out of stock.');
          }
        } else {
          await db.close();
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
 * Endpoint 5: Get transaction history
 * Gets information for all items in the transaction history for the user.
 * Returns an array of information for each transaction.
 */
app.get('/history', async function(req, res) {
  try {
    if (currUser) {
      let db = await getDBConnection();
      let query = 'SELECT * FROM purchases WHERE uid = ?';
      let data = await db.all(query, [currUser]);
      await db.close();
      res.type('json').send(data);
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
 * TODO
 * Daria Manguling
 * Endpoint 6: Give feedback
 * POST parameters: title, stars, description
 */
app.post('/feedback', async function(req, res) {
});

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
    if (username && password) {
      let db = await getDBConnection();
      let data1 = await db.all('SELECT * FROM users WHERE username = ?;', [username]);
      if (data1.length != 1) {
        let data2 = await db.all('SELECT * FROM users WHERE email = ?;', [email]);
        if (data2.length != 1) {
          let query3 = 'INSERT INTO users(username, password, email) VALUES (?, ?, ?);';
          await db.exec(query3, [username, password, email]);
          await db.close();
          res.type('text').send('User successfully created.');
        } else {
          await db.close();
          res.type('text').status(400)
            .send('Email already in use.');
        }
      } else {
        await db.close();
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
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'app.db',
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
