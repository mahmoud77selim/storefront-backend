import { app } from '../index';
import { Product } from '../models/product';
import supertest from 'supertest';

const request = supertest(app);
let product: Product,
  products: Product[],
  token: string,
  result: supertest.Response;

describe('Product endpoints', () => {
  beforeAll(async () => {
    const result = await request
      .post('/users')
      .send({ username: 'testUser', password: 'secret' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    token = result.body;
  });

  afterAll(async () => {
    const result = await request
      .delete('/users/1')
      .send({ token: token })
      .set('Authorization', `Bearer ${token}`);
  });

  describe('POST /products', () => {
    it('should return status 401 with no token', async () => {
      result = await request
        .post('/products')
        .send({ name: 'Pencils', price: '5', category: 'stationery' });

      expect(result.status).toEqual(401);
    });

    it('responds with status 200 with token', async () => {
      result = await request
        .post('/products')
        .send({
          name: 'Pencils',
          price: '5',
          category: 'stationery',
          token: token,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      product = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return new product', () => {
      expect(result.body).toEqual({
        id: product.id as string,
        name: 'Pencils',
        price: 5,
        category: 'stationery',
      });
    });
  });

  describe('GET /products', () => {
    it('responds with status 200', async () => {
      result = await request.get('/products');

      products = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return products', () => {
      expect(result.body).toEqual([
        {
          id: product.id,
          name: 'Pencils',
          price: 5,
          category: 'stationery',
        },
      ]);
    });
  });

  describe('GET /products/1', () => {
    it('responds with status 200', async () => {
      result = await request.get('/products/1');

      product = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return product', async () => {
      expect(result.body).toEqual({
        id: product.id,
        name: 'Pencils',
        price: 5,
        category: 'stationery',
      });
    });
  });

  describe('DELETE /products/1', () => {
    it('responds with status 200', async () => {
      result = await request
        .delete('/products/1')
        .send({ token: token })
        .set('Authorization', `Bearer ${token}`);

      products = result.body;

      expect(result.status).toEqual(200);
    });

    it('should return no products', async () => {
      result = await request.get('/products');
      expect(result.body).toEqual([]);
    });
  });
});
