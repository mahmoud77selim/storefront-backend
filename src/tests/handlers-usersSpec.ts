import { app } from '../index';
import { User } from '../models/user';
import supertest from 'supertest';

const request = supertest(app);
let user: User, users: User[], token: string, result: supertest.Response;

describe('User endpoints', () => {
  describe('POST /users', () => {
    it('responds with status 200 with token', async () => {
      result = await request.post('/users').send({
        first_name: 'Anne',
        last_name: 'Hathaway',
        username: 'AnneHthy',
        password: 'mysecret12345',
      });
      token = result.body;
      expect(result.status).toEqual(200);
    });
  });

  describe('GET /users', () => {
    it('responds with status 200', async () => {
      result = await request
        .get('/users')
        .send({ token: token })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      users = result.body;
      user = users[users.length - 1];

      expect(result.status).toEqual(200);
    });

    it('should return users', () => {
      expect(result.body).toContain(
        jasmine.objectContaining({
          first_name: 'Anne',
          last_name: 'Hathaway',
          username: 'AnneHthy',
        })
      );
    });
  });

  describe('GET /users/1', () => {
    it('responds with status 200', async () => {
      result = await request
        .get(`/users/${user.id}`)
        .send({ token: token })
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
    });

    it('should return user', () => {
      expect(result.body).toEqual(
        jasmine.objectContaining({
          first_name: 'Anne',
          last_name: 'Hathaway',
          username: 'AnneHthy',
        })
      );
    });
  });

  describe('DELETE /users/1', () => {
    it('responds with status 200', async () => {
      result = await request
        .delete(`/users/${user.id}`)
        .send({ token: token })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
    });

    it('should return user objects less by one', async () => {
      result = await request
        .get('/users')
        .send({ token: token })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(result.body.length).toEqual(users.length - 1);
    });
  });
});
