import { Application, Router } from 'express';

import { productsRoute } from './handlers/products';
import { usersRoute } from './handlers/users';
import { ordersRoute } from './handlers/orders';
import { dashboardRoutes } from './handlers/dashboard';

const _routes: [string, Router][] = [
  ['/', productsRoute],
  ['/', usersRoute],
  ['/', ordersRoute],
  ['/', dashboardRoutes],
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
