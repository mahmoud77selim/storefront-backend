import { app } from '../index';
import { Order } from '../models/order';
import supertest from 'supertest';

const request = supertest(app);
let order: Order, orders: Order[], token: string, result: supertest.Response;

describe('Orders endpoints', () => {
  beforeAll(async () => {
    const result = await request
      .post('/users')
      .send({ username: 'testUser', password: 'secret' })
      .set('Accept', 'application/json');
    token = result.body;
  });

  afterAll(async () => {
    const result = await request
      .delete('/users/1')
      .send({ token: token })
      .set('Authorization', `Bearer ${token}`);
  });

  describe('POST /orders', () => {
    it('should return status 401 with no token', async () => {
      result = await request.post('/orders').send({ status: 'active' });

      expect(result.status).toEqual(401);
    });

    it('responds with status 200 with token', async () => {
      result = await request
        .post('/orders')
        .send({ status: 'active', user_id: '1', token: token })
        .set('Authorization', `Bearer ${token}`);

      order = result.body;
      expect(result.status).toEqual(200);
    });

    it('should return new order', () => {
      expect(result.body).toEqual({
        id: order.id as string,
        status: 'active',
        user_id: 1,
      });
    });
  });

  describe('GET /orders', () => {
    it('responds with status 200', async () => {
      result = await request
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);

      orders = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return orders', () => {
      expect(result.body).toEqual([
        {
          id: order.id,
          status: 'active',
          user_id: 1,
        },
      ]);
    });
  });

  describe('DELETE /orders/1', () => {
    it('responds with status 200', async () => {
      result = await request
        .delete('/orders/1')
        .send({ token: token })
        .set('Authorization', `Bearer ${token}`);

      orders = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return no orders', async () => {
      result = await request
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);
      expect(result.body).toEqual([]);
    });
  });
});
