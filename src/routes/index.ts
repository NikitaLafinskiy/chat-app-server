import { Application } from "express";
import authRoute from "./auth/auth.route";
import chatRoute from "./chat/chat.route";

export const routesInit = (app: Application) => {
  app.use(authRoute);
  app.use(chatRoute);
};
