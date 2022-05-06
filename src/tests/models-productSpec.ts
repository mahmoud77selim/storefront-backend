import { Product, ProductStore } from '../models/product';

const store = new ProductStore();
let product: Product;

describe('Product Model', () => {
  describe('should have CRUD methods', () => {
    it('should have an index method', () => {
      expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
      expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });
    it('should have an update method', () => {
      expect(store.update).toBeDefined();
    });
    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'opal necklace',
      price: 1450,
      category: 'jewelry',
    });
    product = result;
    expect(result).toEqual({
      id: product.id,
      name: 'opal necklace',
      price: 1450,
      category: 'jewelry',
    });
    product = result;
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: product.id,
        name: 'opal necklace',
        price: 1450,
        category: 'jewelry',
      },
    ]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(product.id);
    expect(result).toEqual({
      id: product.id,
      name: 'opal necklace',
      price: 1450,
      category: 'jewelry',
    });
  });

  it('delete method should remove the product', async () => {
    await store.delete(product.id);
    const result = await store.index();

    expect(result).toEqual([]);
  });
});
