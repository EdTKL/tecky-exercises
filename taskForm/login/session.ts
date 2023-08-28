import expressSession from "express-session";
import { env_config } from "../env";

export const applySessionMiddleware = expressSession({
  secret: env_config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});

declare module "express-session" {
  interface SessionData {
    userId?: number;
    name?: string;
  }
}
