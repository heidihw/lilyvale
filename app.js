/**
 * Name:    Daria Manguling, Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG, Allison and Marina
 *
 * This is the index.html for all pages of the anime shopping site.
 */

'use strict';

const ITEMS_URL = 'data/items.json';
const ITEM_DETAILED_URL = 'data/item-detailed.json';
const CART_URL = 'data/cart.json';
const FILTERS_URL = 'data/filters.json';
const HISTORY_URL = 'data/history.json';

// const CLIENT_ERR_STATUS = 400;
const SERVER_ERR_STATUS = 500;
const LOCAL_PORT = 8000;

const express = require('express');
const app = express();

const fs = require("fs").promises; // node module to interact with filesystem for file i/o
const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware

// for application/json
app.use(express.json()); // built-in middleware

// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// Heidi Wang
app.get('/items', async function(req, res) {
  try {
    let data = await fs.readFile(ITEMS_URL, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * TODO
 * POST parameters: username, password
 */
app.post('/login', async function(req, res) {
});

/**
 * TODO
 * query parameters: id
 * but APIDOC has id as a query parameter
 */
app.get('/item/:id', async function(req, res) {
  try {
    let data = await fs.readFile(ITEM_DETAILED_URL, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * TODO
 * POST parameters: id
 */
app.get('/purchase', async function(req, res) {
  try {
    let data = await fs.readFile(CART_URL, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * TODO
 * query parameters: name type franchise price order
 */
app.get('/search', async function(req, res) {
  try {
    let data = await fs.readFile(FILTERS_URL, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * TODO
 * POST parameters: username
 */
app.get('/history', async function(req, res) {
  try {
    let data = await fs.readFile(HISTORY_URL, 'utf8');
    data = JSON.parse(data);
    res.type('json').send(data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * TODO
 * POST parameters: title, stars, description
 */
app.post('/feedback', async function(req, res) {
});

/**
 * TODO
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
    res.type('text').status(SERVER_ERR_STATUS)
      .send('File not found on the server');
  } else {
    res.type('text').status(SERVER_ERR_STATUS)
      .send('Something went wrong on the server');
  }
}

// tells the code to serve static files in a directory called 'public'
app.use(express.static('public'));

// specify the port to listen on
const PORT = process.env.PORT || LOCAL_PORT;

// tells the application to run on the specified port
app.listen(PORT);
