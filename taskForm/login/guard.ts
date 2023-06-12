import "./session";
import { Request, Response, NextFunction } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    next(); //logged in users
  } else {
    res.redirect("/"); //guests not logged in
  }
};
