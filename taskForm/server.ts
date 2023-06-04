import express, { Request, Response } from "express";
import path from "path";
import { db } from "./db";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
const protectedPath = path.resolve(__dirname, "protected");
app.use(express.static(protectedPath));

type planInput = {
  planName: string;
  planDate: string;
  startLocation: string;
  returnLocation: string;
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  dinnerStart: string;
  dinnerEnd: string;
  pubTrans: boolean;
  walk: boolean;
  drive: boolean;
};

type taskInput = {
  taskDescription: string;
  taskDuration: string;
  taskLocation: string;
  remarks: string;
  priority: boolean;
};

async function getUserID(username: string) {
  let { rows } = await db.query(`SELECT id from users WHERE username = $1`, [
    username,
  ]);
  if (rows.length === 0) {
    throw new Error("This user does not exist!");
  }
  return rows[0].id;
}

app.post("/forms", async (req: Request, res: Response) => {
  try {
    let userID = await getUserID("Felix");
    const combinedForm = req.body as planInput;
    console.log(
      "Current User ID:", userID,
      `\nCombined Form Input:`, combinedForm
    );
    const { rows } = await db.query(
      `INSERT INTO plans (
          plan_name,
          plan_date,
          start_location,
          return_location,
          start_time,
          end_time,
          lunch_start,
          lunch_end,
          dinner_start,
          dinner_end,
          pub_trans,
          walk,
          drive,
          user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
      [
        combinedForm.planName,
        combinedForm.planDate,
        combinedForm.startLocation,
        combinedForm.returnLocation,
        combinedForm.startTime,
        combinedForm.endTime,
        combinedForm.lunchStart,
        combinedForm.lunchEnd,
        combinedForm.dinnerStart,
        combinedForm.dinnerEnd,
        combinedForm.pubTrans,
        combinedForm.walk,
        combinedForm.drive,
        userID,
      ]
    );
    if (rows.length === 0) {
      throw new Error("Cannot add plan form!");
    }
    const planID = rows[0].id;
    try {
      const combinedForm = req.body as taskInput;
      await db.query(
        `INSERT INTO tasks (task_description, task_duration, task_location, remarks, priority, plan_id) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          combinedForm.taskDescription,
          combinedForm.taskDuration,
          combinedForm.taskLocation,
          combinedForm.remarks,
          combinedForm.priority,
          planID,
        ]
      );
      res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.json(err.message);
    }
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
