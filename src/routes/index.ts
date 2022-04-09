import { Application } from 'express';
import authRoute from './auth/auth.route';

export const routesInit = (app: Application) => {
  app.use(authRoute);
};
