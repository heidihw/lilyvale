/**
 * Name:    Heidi Wang
 * Date:    2024 06 02 Sun
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
 * Heidi Wang
 * Helper function for app.get('/items')
 * Builds a query to get items from the database.
 * @param {string} search - the search query parameter provided with the API call.
 * @param {string} order - the order query parameter provided with the API call.
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
    let data1 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
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
        currUser = data['uid'];
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
    let id = req.body.id;
    if (id) {
      if (currUser) {
        let db = await getDBConnection();
        let data1 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
        if (data1) {
          if (data1['quantity'] > 0) {
            await db.exec('UPDATE items SET quantity = quantity - 1 WHERE id = ?;', [id]);
            let query3 = 'INSERT INTO purchases(id, uid) VALUES (?, ?);';
            let data3 = await db.run(query3, [id, currUser]);
            let data4 = await db.get('SELECT * FROM purchases WHERE pid = ?;', [data3.lastID]);
            await db.close();
            res.type('json').send(data4);
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
      let data1 = await db.all('SELECT * FROM purchases WHERE uid = ?;', [currUser]);
      let items = [];
      for (let i = 0; i < data1.length; i++) {
        let id = data1[i]['id'];
        let data2 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
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
 * Writes a new review. Updates the overall rating of the item.
 * Returns the information for the posted review.
 * POST parameters: title, rating, description
 */
app.post('/feedback', async function(req, res) {
  try {
    let id = req.body.id;
    let title = req.body.title;
    let rating = req.body.rating;
    let desc = req.body.description;
    if (id && title && rating && desc) {
      if (currUser) {
        let db = await getDBConnection();
        let data1 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
        if (data1) {
          let query2 = 'SELECT * FROM purchases WHERE id = ? AND uid = ?;';
          let data2 = await db.get(query2, [id, currUser]);
          if (data2) {
            let data3 = await db.get('SELECT * FROM reviews WHERE pid = ?;', [data2['pid']]);
            if (!data3) {
              let dataOut = await addReview(id, data2['pid'], title, rating, desc);
              await db.close();
              res.type('text').send(dataOut);
            } else {
              await db.close();
              res.type('text').status(400)
                .send('User has already reviewed this item.');
            }
          } else {
            await db.close();
            res.type('text').status(400)
              .send('User has not purchased this item before.');
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
 * Helper function for app.post('/feedback')
 * Inserts the new review. Updates the overall rating of the item.
 * @param {int} id - the id POST parameter provided with the API call.
 * @param {int} pid - the id of the purchase resulting from the query in the parent function.
 * @param {string} title - the title POST parameter provided with the API call.
 * @param {int} rating - the rating POST parameter provided with the API call.
 * @param {string} desc - the desc POST parameter provided with the API call.
 * @returns {JSON} - the information for the posted review.
 */
async function addReview(id, pid, title, rating, desc) {
  try {
    let db = await getDBConnection();
    let query4 = 'INSERT INTO reviews(id, uid, pid, title, rating, desc)';
    query4 += 'VALUES (?, ?, ?, ?, ?, ?);';
    let data4 = await db.run(query4, [id, currUser, pid, title, rating, desc]);

    let data5 = await db.all('SELECT * FROM reviews WHERE id = ?;', [id]);
    let data6 = await db.get('SELECT * FROM items WHERE id = ?;', [id]);
    let query7 = 'UPDATE items SET rating = ? WHERE id = ?;';
    if (data6['rating']) {
      let overall = (data6['rating'] * (data5.length - 1) + rating) / data5.length;
      await db.exec(query7, [overall, id]);
    } else {
      await db.exec(query7, [rating, id]);
    }

    let dataOut = await db.get('SELECT * FROM reviews WHERE rid = ?;', [data4.lastID]);
    await db.close();
    return dataOut;
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong. Please try again later.');
  }
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
      let db = await getDBConnection();
      let data1 = await db.get('SELECT * FROM users WHERE username = ?;', [username]);
      if (data1) {
        let data2 = await db.get('SELECT * FROM users WHERE email = ?;', [email]);
        if (data2) {
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
