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
 * TODO
 * Daria Manguling
 * Endpoint 2: Login with credentials
 * POST parameters: username, password
 */
app.post('/login', async function(req, res) {
  let id = req.body.id;
  if (/** db contains id */) {
    currUser = id;
  } else {
    // fail;
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
 * TODO
 * Daria Manguling
 * Endpoint 4: Make a transaction
 * POST parameters: id
 */
app.post('/purchase', async function(req, res) {
  if (currUser)
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
      data = await db.all(query, [currUser]);
      await db.close();
      res.type('json').send(data);
    } else {
      res.type('text').status(400).send('User not logged in.');
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
 * TODO
 * Daria Manguling
 * Endpoint 7: Create a user
 * POST parameters: username, password, email
 */
app.post('/create-user', async function(req, res) {
});

/**
 * Sends the appropriate error message for the situation with the status code for a server error.
 * @param {exception} err - the contents of the error.
 * @param {Promise} res - the response Promise with which to send the error.
 */
function handleError(err, res) {
  if (err.code === 'ENOENT') {
    res.type('text').status(500)
      .send('File not found on the server');
  } else {
    res.type('text').status(500)
      .send('Something went wrong on the server');
  }
}

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
