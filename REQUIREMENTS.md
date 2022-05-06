# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.


These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

### Endpoints requirements
#### Products 
- Index 
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show (args: id)[token required]
- Create (args: User)[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## API Endpoints 

e.g authorization header for endpoints that require token
```json
{ "Authorization": "Bearer <long-user-token>" }
```

### Products Endpoints
* Index of all products

```bash
GET /products
```

* Show details for product (id: 1)

```bash
GET /products/1
```

* Create new product (token required)

```bash
POST /products/1
```
e.g req.body json

```json
{ 
    "name": "Turkish Delight Deluxe",
    "price": "85",
    "category": "Sweet Treats" 
}
```

* Show products in a category (e.g. category 'Fine Dining')

```bash
GET /products/categories/fine_dining
```

* Show top 5 most popular products

```bash
GET /products/top_five
```

### Users Endpoints
* Index of all users (token required)

```bash
GET /users
```

* Show user (id: 1) details (token required)

```bash
GET /users/1
```

* Create new user

```bash
POST /users
```

e.g req.body json

```json
{ 
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "JaneDoe",
    "password": "mysercret123" 
}
```

* User login

```bash
POST /users/login
```
e.g req.body json

```json
{ 
    "username": "JaneDoe",
    "password": "mysercret123" 
}
```

### Orders Endpoints
* Index of all orders (token required)

```bash
GET /orders
```
* Show order (id: 1) details (token required)

```bash
GET /orders/1
```

* Create new order (token required)

```bash
POST /orders
```
e.g req.body json 

```json
{ 
    "user_id": "1"
}
```

* Create new order for user (id: 1) (token required)

```bash
POST /users/1/orders
```
e.g req.body json 

```json
{ 
    "status": "complete"
}
```
> Note - no payload json required for this endpoint if status of order to be created is "active"

* Show all orders for user (id: 1) (token required)

```bash
GET /users/1/orders
```

* Show active orders for user (id: 1) (token required)

```bash
GET /users/1/orders/active
```
* Show completed orders for user (id: 1) (token required)

```bash
GET /users/1/orders/completed
```

### Dashboard Endpoints
```bash
GET /top_five_products
```
> This returns the top five most popular products from all orders made.

## Database Tables and Schemas

### Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## *products* Table
| Column   | Data Type      |
| -------- | -----------    |
| id       | PRIMARY SERIAL KEY
| name     | VARCHAR(100)
| price    |integer
| category | VARCHAR(150)

## *users* Table
| Column          | Data Type      |
| -----------     | -----------    |
|id               | PRIMARY SERIAL KEY |
| first_name      |  VARCHAR(100) |
| last_name       | VARCHAR(100) |
| username        | VARCHAR(100) |
| password_digest | VARCHAR(255) |

## *orders* Table
| Column   | Data Type      |
| ---------| -----------    |
| id       | PRIMARY SERIAL KEY
| user_id  | integer REFERENCES users(id) 
| status   | VARCHAR(20)

## *order_products* Table
| Column      | Data Type      |
| ----------- | -----------    |
| id          | PRIMARY SERIAL KEY
| quantity    | integer
| product_id  | integer REFERENCES products(id) 
| order_id    | integer REFERENCES orders(id) 
