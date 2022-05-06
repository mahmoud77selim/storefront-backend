import Client from '../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCYPT_PASSWORD as string;
const saltrounds = process.env.SALT_ROUNDS;

export type User = {
  id: string | undefined;
  username: string;
  first_name: string;
  last_name: string;
  password?: string | undefined;
};

export type PartialUser = Partial<User>;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      const users: User[] = result.rows as User[];

      return users;
    } catch (err) {
      throw new Error(`Could not find users. ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const user: User = result.rows[0] as User;
      // console.log("show user",user)
      return user;
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`);
    }
  }

  async create(u: PartialUser): Promise<User> {
    const hash = bcrypt.hashSync(
      u.password + pepper,
      parseInt(saltrounds as string)
    );

    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
      ]);
      conn.release();
      const user: User = result.rows[0] as User;

      return user;
    } catch (err) {
      throw new Error(`Could not create new user ${u.id}. ${err}`);
    }
  }

  async update(id: string, u: PartialUser): Promise<User> {
    const hash = bcrypt.hashSync(
      u.password + pepper,
      parseInt(saltrounds as string)
    );

    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET first_name = $1, last_name = $2 username=$3, password_digest=$4 WHERE id=$5 RETURNING *';
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
        id,
      ]);
      conn.release();
      const user: User = result.rows[0] as User;

      return user;
    } catch (err) {
      throw new Error(`Could not update user ${id}. ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const user: User = result.rows[0] as User;

      return user;
    } catch (err) {
      throw new Error(`Could not create new user ${id}. ${err}`);
    }
  }

  async authenticate(username: string, password: string) {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT password_digest FROM users WHERE username=($1)';
      const result = await conn.query(sql, [username]);
      conn.release();

      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Authentication failed. ${err}`);
    }
  }
}
