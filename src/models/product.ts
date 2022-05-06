import Client from '../database';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type PartialProduct = Partial<Product>;

export class ProductStore {
  index = async (): Promise<Product[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      const products: Product[] = result.rows as Product[];

      return products;
    } catch (err) {
      throw new Error(`Could not find products. ${err}`);
    }
  };

  show = async (id: string): Promise<Product> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const product: Product = result.rows[0] as Product;

      return product;
    } catch (err) {
      throw new Error(`Could not find product ${id}. ${err}`);
    }
  };

  create = async (p: PartialProduct): Promise<Product> => {
    let category = p.category;

    if (typeof category === 'undefined') {
      category = '';
    }

    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, category]);
      conn.release();
      const product: Product = result.rows[0] as Product;

      return product;
    } catch (err) {
      throw new Error(`Could not create new product ${p.name}. ${err}`);
    }
  };

  update = async (id: string, p: PartialProduct): Promise<Product> => {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE products SET name = $1, price = $2 category=$3, WHERE id=$4 RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category, id]);
      conn.release();
      const product: Product = result.rows[0] as Product;

      return product;
    } catch (err) {
      throw new Error(`Could not update product ${id}. ${err}`);
    }
  };

  delete = async (id: string): Promise<Product> => {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const product: Product = result.rows[0] as Product;

      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. ${err}`);
    }
  };

  categoryIndex = async (category: string): Promise<Product[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const result = await conn.query(sql, [category]);
      conn.release();
      const products: Product[] = result.rows as Product[];

      return products;
    } catch (err) {
      throw new Error(
        `Could not find products in '${category}' category. ${err}`
      );
    }
  };

  topFiveProducts = async (): Promise<
    { name: string; price: number; order_id: string }[]
  > => {
    try {
      const conn = await Client.connect();
      const sql = `SELECT products.id, products.name, products.price, count(order_products.order_id), SUM(order_products.quantity)
          FROM products RIGHT JOIN order_products ON products.id = order_products.product_id GROUP BY products.id, products.name, products.price 
          ORDER BY count(order_products.order_id), SUM(order_products.quantity) DESC 
          LIMIT 5`;

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Count not find top 5 products: ${err}`);
    }
  };

  async showOrderProducts(orderId: string): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      let sql =
        'SELECT products.id, products.name, products.price, order_products.quantity, order_products.order_id FROM order_products INNER JOIN products ON products.id = order_products.product_id WHERE order_id=$1';
      let result = await conn.query(sql, [orderId]);

      result = await conn.query(sql, [orderId]);
      conn.release();
      const products = result.rows;
      return products;
    } catch (err) {
      throw new Error(`Could not find products for order ${orderId}. ${err}`);
    }
  }
}
