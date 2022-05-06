import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const {
  POSTGRES_PORT,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;
let client: Pool;

if (ENV == 'test') {
  console.log('test environment');
  client = new Pool({
    port: parseInt(POSTGRES_PORT as string),
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else {
  console.log('dev environment');
  client = new Pool({
    port: parseInt(POSTGRES_PORT as string),
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

export default client;
