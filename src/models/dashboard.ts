import Client from '../database';

export class DashboardQueries {
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT name, price, quantity, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find products and orders: ${err}`);
    }
  }
  async topFiveProducts(): Promise<
    { id: string; name: string; price: number; orders_total: number }[]
  > {
    try {
      const conn = await Client.connect();
      const sql = `SELECT product_id, name, price, count(order_id)
      FROM products INNER JOIN order_products ON products.id = order_products.product_id 
      GROUP BY product_id, name, price
      ORDER BY count(order_products.id) DESC
      LIMIT 5`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find products and orders: ${err}`);
    }
  }
}
