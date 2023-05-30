import express, { NextFunction } from "express";
import { Request, Response } from "express";
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
  planName:string
  planDate:string
  startLocation:string
  returnLocation:string
  startTime:string
  endTime:string
  lunchStart:string
  lunchEnd:string
  dinnerStart:string
  dinnerEnd:string
  pubTrans:boolean
  walk:boolean
  drive:boolean
}


async function getID(){
  let {rows} = await db.query("SELECT id from users WHERE username = 'Felix'")
  // console.log(currentUser.rows[0].id)
  if(rows.length === 0){
    throw new Error('not exist this user')
  }
  return rows[0].id
  
};



  app.post("/forms", async (req:Request, res:Response) => {
    try {
      let currentUserID = await getID();
      // console.log(req.body);
      const cf = req.body as planInput;
      console.log('63',cf,currentUserID)
      let {rows} = await db.query(
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10, $11, $12, $13, $14) RETURNING id`,[ 
          cf.planName,
          cf.planDate,
          cf.startLocation,
          cf.returnLocation,
          cf.startTime,
          cf.endTime,
          cf.lunchStart,
          cf.lunchEnd,            
          cf.dinnerStart,
          cf.dinnerEnd,
          cf.pubTrans,
          cf.walk,
          cf.drive,
          currentUserID

      ]);
      if(rows.length === 0){
        throw new Error('Cannot add plan form')
      }

      



      res.json('success')
    } catch (err) {
      console.log(err);
      res.json(err.message)
    }
  });

type taskInput = {
  taskDescription:string
  taskDuration:string
  taskLocation:string
  remarks:string
  priority:boolean
}

  app.post("/forms", async (req:Request, res:Response, next:NextFunction) => {
    try {console.log(req.body);
    const {taskDescription, taskDuration, taskLocation, remarks, priority} = req.body as taskInput
    await db.query(
      `INSERT INTO tasks (task_description, task_duration, task_location, remarks, priority) 
          VALUES ($1, $2, $3, $4, $5)`, [taskDescription, (taskDuration), taskLocation, remarks, priority]
    );
    } catch (err) {
      console.log(err);
    }
  });


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});