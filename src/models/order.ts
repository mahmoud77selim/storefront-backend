import Client from '../database';
import util from '../helpers';

export type Order = {
  id: string;
  status: string;
  user_id: string;
};

export type PartialOrder = Partial<Order>;

export class OrderStore {
  index = async (): Promise<Order[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      const orders: Order[] = result.rows as Order[];

      return orders;
    } catch (err) {
      throw new Error(`Could not find orders. ${err}`);
    }
  };

  show = async (id: string): Promise<Order> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const order: Order = result.rows[0] as Order;

      return order;
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`);
    }
  };

  create = async (o: PartialOrder): Promise<Order> => {
    let status = o.status;

    if (typeof status === 'undefined') {
      status = 'active';
    }

    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.user_id, status]);
      conn.release();
      const order: Order = result.rows[0] as Order;

      return order;
    } catch (err) {
      throw new Error(`Could not create new order ${o}. ${err}`);
    }
  };

  async update(id: string, o: PartialOrder) {
    try {
      const conn = await Client.connect();

      const sql =
        'UPDATE orders SET status = $1, user_id=$2 WHERE id=$3 RETURNING *';
      const result = await conn.query(sql, [o.status, o.user_id, id]);
      conn.release();
      const order: Order = result.rows[0] as Order;

      return order;
    } catch (err) {
      throw new Error(`Could not create new order ${o}. ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM orders WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      const user: Order = result.rows[0] as Order;

      return user;
    } catch (err) {
      throw new Error(`Could not create new user ${id}. ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const conn = await Client.connect();
      let sql =
        'SELECT * FROM order_products WHERE order_id=$1 AND product_id=$2 LIMIT 1';
      let result = await conn.query(sql, [orderId, productId]);

      if (!util.isEmpty(result.rows[0])) {
        sql =
          'UPDATE order_products SET quantity=$1 WHERE order_id=$2 AND product_id=$3 RETURNING *';
      } else {
        sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
      }
      result = await conn.query(sql, [quantity, orderId, productId]);
      conn.release();
      const order = result.rows[0];
      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}. ${err}`
      );
    }
  }

  async usersOrders(userId: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=$1';
      const result = await conn.query(sql, [userId]);
      conn.release();
      const orders = result.rows;

      return orders;
    } catch (err) {
      throw new Error(`Could not find orders for user ${userId}. ${err}`);
    }
  }

  async userActiveOrder(userId: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE status='active' AND user_id=$1";
      const result = await conn.query(sql, [userId]);
      conn.release();
      const orders = result.rows;

      return orders;
    } catch (err) {
      throw new Error(`Could not find active order for user ${userId}. ${err}`);
    }
  }

  async userCompletedOrders(userId: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE status='complete' AND user_id=$1";
      const result = await conn.query(sql, [userId]);
      conn.release();
      const order = result.rows[0];

      return order;
    } catch (err) {
      throw new Error(
        `Could not find completed orders for user ${userId}. ${err}`
      );
    }
  }
}
