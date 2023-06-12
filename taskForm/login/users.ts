import { Request, Response } from "express";
import { db } from "../db";
// import dotenv from "dotenv";
import { checkPassword, hashPassword } from "./hash";
// dotenv.config();

// type User = {
//   id: number;
//   name: string;
//   password: string;
// };

export const login = async (req: Request, res: Response) => {
  try {
    const form = req.body as { name: string; password: string };
    const { rows } = await db.query(
      "SELECT id, name, password from users WHERE name = $1",
      [form.name]
    );

    if (rows.length === 0) {
      throw new Error("This user does not exist / Password does not match");
    }

    const match = await checkPassword(form.password, rows[0].password);
    if (match) {
      console.log(rows);
      req.session.userId = rows[0].id;
      req.session.name = rows[0].name;
      console.log(req.session);
      res.json({ success: true }); // To the protected page.
    } else {
      throw new Error("This user does not exist / Password does not match");
    }

    //   const userList: User[] = usersTable.rows;
    //   console.log(req.session.user);
    //   if (
    //     userList.some(
    //       (user) =>
    //         req.body.username === user.username &&
    //         req.body.password === user.password
    //     )
    //   ) {
    //     console.log("Login is successful");
    //     req.session.user = req.body.username;
    //   } else {
    //     console.log("Login unsuccessful");
    //     return res.status(401).json({ msg: "Wrong Username/Password" });
    //   }
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const regForm = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const hashedPassword = await hashPassword(regForm.password);
    console.log(hashedPassword);
    await db.query(
      "INSERT INTO users (name,email,password) values ($1,$2,$3)",
      [regForm.name, regForm.email, hashedPassword]
    );
    console.log("Registration successful!");
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        res.status(500).send("Failed to logout");
      } else {
        res.sendStatus(200);
      }
    });
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
