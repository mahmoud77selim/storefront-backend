# udacity Advanced Full-Stack Web Development Nanodegree Program

# PROJECT 2 Storefront Backend

This project is a node express server application to manage products and user orders for an online store providing restful api endpoints using Postgres database, dotenv, db-migrate, jsonwebtoken and jasmine.

clone, install dependencies, Build, Test and run server by running the below commands

```bash
git clone https://gitlab.com/mahmoud77selim/storefront-backend.git
```
```bash
cd storefront-backend
```
```bash
cp .env.example .env
```
```bash
yarn
```
```bash
yarn build
```
```bash
yarn lint
```
```bash
yarn prettier
```
```bash
yarn test
```
```bash
yarn docker-up
```
```bash
yarn migrate-up
```

```bash
yarn start
```

# This poject using Postgresql database running by containerization system with the following settings

```bash
POSTGRES_HOST=127.0.0.1
```
```bash
POSTGRES_PORT=5432
```
you need to have docker engine and docker compose installed on your machine to be able to work with this project database
Docker engine and docker compose installation instruction can be found at
```bash
https://docs.docker.com/engine/install/
```
```bash
https://docs.docker.com/compose/install/
```

by running the script
```bash
yarn docker-up
```
compose will create the necessary installation as per as the specification provided in .env,psql.sh and docker-compose.yml 

and for sure you can run this project database manually by installing PostgreSQL locally on your machine installation instruction can be found at
```bash
https://www.postgresql.org/download/
```
after the installation is completed you have to execute the following commands to initialize the project database
```bash
psql -h localhost -U postgres -d postgres
```
```bash
CREATE USER shopping_user WITH PASSWORD 'password123';
```
```bash
CREATE DATABASE shopping;
```
```bash
GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;
```
```bash
CREATE DATABASE shopping_test;
```
```bash
GRANT ALL PRIVILEGES ON DATABASE shopping_test TO shopping_user;
```
```bash
\q
```

## Endpoints
See REQUIREMENTS.md file

## Database Schema
See REQUIREMENTS.md file

# Project By: Mahmoud Hassanein.
