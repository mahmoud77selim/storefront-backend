import express, { Request, Response, Router } from 'express';
import { DashboardQueries } from '../models/dashboard';

const dashboard = new DashboardQueries();
export const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err) {
    res.status(400), res.json({ error: `${err}` });
  }
};

export const topFiveProducts = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.topFiveProducts();
    res.json(products);
  } catch (err) {
    res.status(400), res.json({ error: `${err}` });
  }
};

export const dashboardRoutes: Router = Router();
dashboardRoutes.get('/products_in_orders', productsInOrders);
dashboardRoutes.get('/top_five_products', topFiveProducts);
