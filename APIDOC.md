# Daria Manguling, Heidi Wang API Documentation

This API is for an anime ecommerce site. It allows the client to get data on all items for sale, log in to a user, get detailed information for a specific item including ratings, purchase an item, search and filter for a selection of all of the items, see past purchases, write a rating, and create a new user.

## Get all items

**Request Format:** `/items`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets general information on all the items for sale.

**Example Request:** `/items`

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Toradora Taiga Plush",
    "price": 25,
    "rating": 5,
    "img-src": "imgs/xie-lian-nendoroid.jpeg",
    "filters": {
      "type": "plush",
      "franchise": "toradora",
      "price": "n20-n"
    },
    "count": 3
  }
  // ...
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - None
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Login with credentials

**Request Format:** `/login` endpoint with POST parameters of `username` and `password`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Logs in a user. Checks whether the username and password match an entry in the database.

**Example Request:** POST parameters of `username=john` and `password=abc123`

**Example Response:**

```
Logged in.
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If the provided credentials do not match an entry in the database, returns error with `Invalid username or password.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Get detailed information on an item

**Request Format:** `/item?id={id}`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns more detailed information on an individual item, including name, image, overall rating, price, description, and detailed ratings.

**Example Request:** `/item?id=1`

**Example Response:**

```json
{
  "id": 1,
  "name": "Toradora Taiga Plush",
  "price": 25,
  "rating": 5,
  "img-src": "imgs/xie-lian-nendoroid.jpeg",
  "filters": {
    "type": "plush",
    "franchise": "toradora",
    "price": "n20-n"
  },
  "count": 3,
  "description": "Toradora plushie released by ANIPLEX!",
  "reviews": [
    {
      "title": "Cool!",
      "stars": 5,
      "description": "Omg! I love itttt!"
    },
    {
      "title": "Woahhhhh",
      "stars": 5,
      "description": "This nendoroid is so adorable! I'm so glad I bought it"
    }
  ]
}
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If item id is invalid, returns error with `Item does not exist.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Make a transaction

**Request Format:** `/purchase` endpoint with POST parameters of `id`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Checks whether a transaction is successful, and if so, returns the confirmation code for the succcessful transaction. The user must be logged in.

**Example Request:** POST parameters of `id=1`

**Example Response:**

```
1726598321
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user is not logged in, returns error with `User not logged in.`
  - If item is out of stock, returns error with `Item out of stock.`
  - If item id is invalid, returns error with `Item does not exist.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Search all items

**Request Format:** `/search?name={name}&type={type}&franchise={franchise}&price={price}&order={order}`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Searches the database and returns all items that match the search criteria.

**Example Request:** `/search?franchise=re-zero`

**Example Response:**

```json
[
  {
    "id": 2,
    "name": "Re:Zero Emilia Pin",
    "price": 10,
    "rating": 5,
    "img-src": "imgs/rezero-rem-figurine.jpeg",
    "filters": {
      "type": "pin",
      "franchise": "re-zero",
      "price": "n10-20"
    },
    "count": 0
  }
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - None
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Get transaction history

**Request Format:** `/history` endpoint with POST parameter of `username`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Returns the transaction history for the user. The user must be logged in.

**Example Request:** POST parameter of `username=john`

**Example Response:**

```json
[
  {
    "id": 1726598321,
    "time": "2024/03/12 Fri 16:39 pm",
    "item": 1
  },
  {
    "id": 1726598578,
    "time": "2024/03/12 Fri 18:23 pm",
    "item": 2
  }
]
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user is not logged in, returns error with `User not logged in.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Give feedback

**Request Format:** `/feedback` endpoint with POST parameters of `title`, `stars`, and `description`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Writes a new review with the given title, stars, and description.

**Example Request:** POST parameters of `title=Cool!`, `stars=5`, and `description=Omg! I love itttt!`

**Example Response:**

```json
{
  "title": "Cool!",
  "stars": 5,
  "description": "Omg! I love itttt!"
}
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user is not logged in, returns error with `User not logged in.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Create a user

**Request Format:** `/create-user` endpoint with POST parameters of `username`, `password`, and `email`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Creates a new user with the provided username, password, and email.

**Example Request:** POST parameters of `username=john`, `password=abc123`, and `email=example@email.com`

**Example Response:**

```
User john successfully created.
```

**Error Handling:**

- Possible 400 (invalid request) errors (all plain text):
  - If user with given username already exists, returns error with `User already exists.`
  - If user with given email already exists, returns error with `Email already in use.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`
