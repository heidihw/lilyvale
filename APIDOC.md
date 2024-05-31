# Daria Manguling, Heidi Wang API Documentation

This API is for an anime ecommerce site. It allows the client to get data on all items for sale, log in to a user, get detailed information for a specific item including ratings, purchase an item, search and filter for a selection of all of the items, see past purchases, write a rating, and create a new user.

## Endpoint 1: Get item information

**Request Format:** `/items?name={name}&type={type}&franchise={franchise}&price={price}&order={order}`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets information for the relevant items. Returns an array where each item in the array is information for an item, including item id, name, price, rating, tags, description, and quantity (capacity).
- If no query parameters are included, gets information for all the items.
- If search query parameters are included, searches all items for those that match the search criteria and returns the information for those items.
- Possible search criteria include the item name and values of the tags, including type, franchise, and price.
- If no items match the search criteria, returns an empty JSON array.
- It is also possible to specify the order in which to return the items, with the query parameter `order` with possible values of `price`, `name`, `rating`, and `featured`.

**Example Request:** `/items?franchise=re-zero`

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Toradora Taiga Plush",
    "price": 25,
    "rating": 5,
    "tags": "plush toradora n20-n",
    "desc": "Toradora plushie released by ANIPLEX!",
    "quantity": 3
  }
  // ...
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - None
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 2: Login with credentials

**Request Format:** `/login` endpoint with POST parameters of `username` and `password`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Logs in to a user. Checks whether the username and password match an entry in the database. Returns a confirmation message.

**Example Request:** POST request with parameters of `username=john` and `password=abc123`

**Example Response:**

```
Logged in.
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If the provided credentials do not match an entry in the database, returns error with `Invalid username or password.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 3: Get detailed information on an item

**Request Format:** `/item/:id`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets detailed information on an individual item. Returns an array where the first item in the array is the information for the item, including item id, name, price, rating, tags, description, and quantity. All additional following items in the array are information for ratings for the item, including review id, item id, user id, title, rating, and description.

**Example Request:** `/item/1`

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Toradora Taiga Plush",
    "price": 25,
    "rating": 5,
    "tags": "plush toradora n20-n",
    "desc": "Toradora plushie released by ANIPLEX!",
    "quantity": 3
  }
  {
    "rid": 1,
    "id": 1,
    "uid": 1,
    "pid": 1,
    "title": "Cool!",
    "rating": 5,
    "desc": "Omg! I love itttt!"
  }
  // ...
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If item id is invalid, returns error with `Item does not exist.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 4: Make a transaction

**Request Format:** `/purchase` endpoint with POST parameter of `id`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Makes a transaction. Returns the information for the transaction, including purchase id (confirmation code), item id, user id, and time of the transaction.
- The user must be logged in.

**Example Request:** POST request with parameter of `id=1`

**Example Response:**

```json
{
  "pid": 1,
  "id": 1,
  "uid": 1,
  "time": "2024-03-12 16:39:02",
}
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user is not logged in, returns error with `User not logged in.`
  - If item is out of stock, returns error with `Item out of stock.`
  - If item id is invalid, returns error with `Item does not exist.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 5: Get transaction history

**Request Format:** `/history`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets information for all items in the transaction history for the user. Returns an array where each item in the array is the information for each transaction, including purchase id, item id, user id, and time.
- The user must be logged in.

**Example Request:** `/history`

**Example Response:**

```json
[
  {
    "pid": 1,
    "id": 1,
    "uid": 1,
    "time": "2024-03-12 16:39:02",
  }
  // ...
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user is not logged in, returns error with `User not logged in.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 6: Give feedback

**Request Format:** `/feedback` endpoint with POST parameters of `title`, `stars`, and `description`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Writes a new review with the given title, rating, and description. Returns the information for the posted review, including the review id, item id, and user id, as well as the provided title, rating, and description.
- The user must have purchased the item before.
- The user must be logged in.

**Example Request:** POST request with parameters of `title=Cool!`, `stars=5`, and `description=Omg! I love itttt!`

**Example Response:**

```json
{
  "rid": 1,
  "id": 1,
  "uid": 1,
  "pid": 1,
  "title": "Cool!",
  "rating": 5,
  "desc": "Omg! I love itttt!"
}
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user has not purchased the item before, returns error with `User has not purchased this item before.`
  - If user is not logged in, returns error with `User not logged in.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Endpoint 7: Create a user

**Request Format:** `/create-user` endpoint with POST parameters of `username`, `password`, and `email`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Creates a new user with the provided username, password, and email. Returns a confirmation message.

**Example Request:** POST request with parameters of `username=john`, `password=abc123`, and `email=example@email.com`

**Example Response:**

```
User successfully created.
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user with given username already exists, returns error with `User already exists.`
  - If user with given email already exists, returns error with `Email already in use.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`
