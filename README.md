
## Description
A vending machine API built with NestJs with TypeScript with Sequelize ORM and MySQL database with Exception handling, Validations,
authentication and authorization using JWT and RBAC

## Initial Setup

### 1- create the .env file with all the required keys.

### 2- configre the database connection in the .config file then create the database.

Make sure there is mysql server instance is running on your machine.<br />
The application is configured by default to use port 8888 for the database connection.

```bash
$ npx sequelize-cli db:create
```
### 3- after creating the database run the migration file to create the necessary tables and associations.

```bash
$ npx sequelize-cli db:migrate
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
