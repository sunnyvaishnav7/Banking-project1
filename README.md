# Banking Project Backend

A Node.js + Express + MongoDB banking backend for user authentication, account management, and money transfer operations.

## Overview

This project provides a backend API for:
- user registration and login
- JWT-based authentication
- account creation and balance lookup
- fund transfer between accounts
- system-user initial funding flow
- email notifications on registration and transaction events

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- nodemailer for email notifications
- cookie-parser for cookie-based auth support

## Project Structure

```bash
.
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── account.controllers.js
│   │   ├── auth.controllers.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blackList.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   └── services/
│       └── email.service.js
├── .env
├── package.json
├── server.js
├── README.md
└── node_modules/
```

## Prerequisites

Before running this project, make sure you have:

- Node.js installed (preferably v18 or above)
- npm installed
- MongoDB database available (MongoDB Atlas or local MongoDB)
- Email credentials for Gmail SMTP if you want email notifications to work

## Installation

1. Open terminal in the project folder.

```bash
cd "D:\Banking project"
```

2. Install required dependencies.

```bash
npm install
```

This will install:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cookie-parser
- nodemailer
- nodemon

## Environment Setup

Create a `.env` file in the project root and add the following values.

```env
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_email@gmail.com
GOOGLE_USER=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_app_password
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_refresh_token
```

### Notes
- `MONGO_URI` is required for database connection.
- `JWT_SECRET` is required for token generation and verification.
- For email features, Gmail OAuth setup is used in the project. If you are not testing email sending, the app can still boot, but email sending may fail if those values are missing or invalid.

## Run the Backend

### Development mode

```bash
npm run dev
```

### Direct run

```bash
node server.js
```

The app runs on:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

#### 1. Register user
- Method: `POST`
- URL: `/api/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### 2. Login user
- Method: `POST`
- URL: `/api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### 3. Logout user
- Method: `POST`
- URL: `/api/auth/logout`

Headers:

```http
Authorization: Bearer <token>
```

---

### Accounts

#### 4. Create account
- Method: `POST`
- URL: `/api/accounts`
- Auth required

Request body:

```json
{
  "currency": "INR"
}
```

#### 5. Get all accounts of the logged-in user
- Method: `GET`
- URL: `/api/accounts`
- Auth required

#### 6. Get account balance
- Method: `GET`
- URL: `/api/accounts/balance/:accountId`
- Auth required

---

### Transactions

#### 7. Transfer money between accounts
- Method: `POST`
- URL: `/api/transactions`
- Auth required

Request body:

```json
{
  "fromAccount": "ACCOUNT_ID_1",
  "toAccount": "ACCOUNT_ID_2",
  "amount": 100,
  "idempotencyKey": "txn-001"
}
```

#### 8. System initial funds
- Method: `POST`
- URL: `/api/transactions/system/initial-funds`
- Auth required for a system user

Request body:

```json
{
  "toAccount": "ACCOUNT_ID",
  "amount": 1000,
  "idempotencyKey": "funds-001"
}
```

## Authentication

Protected routes expect either:
- a JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

or a valid cookie named `token`.

## Example Test Flow

1. Register a user
2. Login and copy JWT token
3. Create an account using the token
4. Create another user and account
5. Transfer money from one account to another
6. Check balance for both accounts

## Common Troubleshooting

### Duplicate key / username index issue

If you see an error like:

```text
MongoServerError: E11000 duplicate key error ... index: username_1
```

That means MongoDB still has a stale unique index on `username` from an earlier version of the project. Run:

```js
db.getCollection("users").getIndexes()
```

If `username_1` exists, remove it:

```js
db.getCollection("users").dropIndex("username_1")
```

The project also drops this stale index automatically on app startup when possible.

### Missing `.env` values

If the app fails to start or authentication breaks, check your `.env` values for:
- `MONGO_URI`
- `JWT_SECRET`
- email credentials

## Notes

- The app uses `PORT` logic through the Node server and currently runs on `3000`.
- The transaction flow validates idempotency by using a unique `idempotencyKey`.
- The app includes email notifications for registration and transfer events.

## License

This project is for educational/backend development purposes.

## Author

Created for a banking backend API project.
