import express from "express";
import { Request, Response } from "express";
import path from "path";
import { db } from "./db";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
const protectedPath = path.resolve(__dirname, "forms");
app.use(express.static(protectedPath));

type taskInput = {
  taskDescription:string
  taskDuration:number
  taskLocation:string
  remarks:string
  priority:boolean
}
  app.post("/forms", async (req:Request, res:Response) => {
    console.log(req.body);
    const {taskDescription, taskDuration, taskLocation, remarks, priority} = req.body as taskInput
    await db.query(
      `INSERT INTO tasks (task_description, task_duration, task_location, remarks, priority, created_at) 
          VALUES ($1, $2, $3, $4, $5, NOW())`, [taskDescription, taskDuration, taskLocation, remarks, priority]
    );
  
    res.json({ Success: true });
  });


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});