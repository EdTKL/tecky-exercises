import express, { Request, Response } from "express";
import path from "path";
import { db } from "./db";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { env_config } from './env';
const configuration = new Configuration({
  apiKey: env_config.CHAT_GPT_TOKEN,
  basePath: env_config.CHAT_GPT_BASE_PATH

});
const openAi = new OpenAIApi(configuration);

async function callChatGPT(question: string) {
  let messageArr = [
    { role: "user", content: question }
  ] as Array<ChatCompletionRequestMessage>
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messageArr,
  });
  const res = completion.data.choices[0].message as { role: string, content: string };
  console.log(res);
  return res;
};


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
const protectedPath = path.resolve(__dirname, "protected");
app.use(express.static(protectedPath));

// type planInput = {
//   planName: string;
//   planDate: string;
//   startLocation: string;
//   returnLocation: string;
//   startTime: string;
//   endTime: string;
//   lunchStart: string;
//   lunchEnd: string;
//   dinnerStart: string;
//   dinnerEnd: string;
//   pubTrans: boolean;
//   walk: boolean;
//   drive: boolean;
// };

// type taskInput = {
//   taskDescription: string;
//   taskDuration: number;
//   taskLocation: string;
//   remarks: string;
//   priority: boolean;
// };

async function getUserID(username: string) {
  let { rows } = await db.query(`SELECT id from users WHERE name = $1`, [
    username,
  ]);
  if (rows.length === 0) {
    throw new Error("This user does not exist!");
  }
  return rows[0].id;
}

// for decrypt
import * as CryptoJS from 'crypto-js';
import { prepareRequirements } from "./gpt/requirement";

let secret = 'dskngiuewnvlkdnvioenvlkniowe';
let options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
// interface enData {
//   en: String
// }
function decrypt(encrypt: string) {
  let decrypt = CryptoJS.AES.decrypt(encrypt, secret, options);
  // console.log(decrypt)
  let data = decrypt.toString(CryptoJS.enc.Utf8);
  let reqData = JSON.stringify(data);
  // console.log("decrypt", reqData);
  // console.log(JSON.parse(reqData));
  let reqDataObj = JSON.parse(JSON.parse(reqData));
  console.log(reqDataObj);
  return reqDataObj;
};

function encrypt(data: object) {
  // console.log(JSON.stringify(data));
  let json = CryptoJS.AES.encrypt(JSON.stringify(data), secret, options);
  // console.log(json);
  let encrypt = json.formatter.stringify(json);
  // console.log("encrypt", encrypt);
  return encrypt;
};

//check plan is exist? when save/submit clicked
app.get("/check", async (req: Request, res: Response) => {
  try {
    // check user
    let userID = await getUserID("katie");

    //search by id
    const planID = req.query.ID;

    let tempEnData = await db.query(
      `SELECT content FROM temp WHERE temp.id = $1 and temp.user_id = $2`,
      [
        planID,
        userID
      ]
    );
    if (tempEnData.rows.length === 0) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }

    //search by keywords
    //write code later when search box is made

  } catch (err) {
    console.log("debug la search")
    console.log(err);
    res.json(err.message);
  };
});

//if plan not exist, create planID
app.post("/forms", async (req: Request, res: Response) => {
  try {
    // current user is who --> his id is?
    let userID = await getUserID("katie");
    // let userID = 1;
    console.log(userID);
    // decrypt
    console.log(req.body);
    let reqBody = await decrypt(req.body.en);
    // let decrypt = CryptoJS.AES.decrypt(req.body, secret, options);
    // console.log(decrypt)
    // let data = decrypt.toString(CryptoJS.enc.Utf8);
    // let reqData = JSON.parse(JSON.stringify(data));
    // console.log("decrypt", reqData);

    let reqData = {
      planFormData: reqBody.planFormData,
      taskFormData: reqBody.taskFormData,
      clickButton: reqBody.clickButton
    };
    console.log(reqData);

    // input to temp table becuase save/ok button also need input to temp table
    await db.query(
      `INSERT INTO temp (
        user_id,
        content
        ) 
        VALUES ($1, $2)`,
      [
        userID,
        // JSON.stringify(reqData)
        req.body
      ]
    );

    // take out the inserted data's id for plan_id
    const result = await db.query(
      `Select id from temp where content=$1`,
      [
        req.body
      ]
    );
    const planID = result.rows[0].id;
    console.log(planID);

    //data for making saved plan button
    let planButtonData = {
      userID: userID,
      planID: planID,
      planName: reqData.planFormData.planName,
      planDate: reqData.planFormData.planDate,
      resultHTML: "",
      actionDone: ""
    };
    let body = "";

    if (reqData.clickButton === "ok-btn") {
      // input to plan and task tables
      await db.query(
        `INSERT INTO plans (
            plan_id,
            name,
            date,
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          planID,
          reqData.planFormData.planName,
          reqData.planFormData.planDate,
          reqData.planFormData.startLocation,
          reqData.planFormData.returnLocation,
          reqData.planFormData.startTime,
          reqData.planFormData.endTime,
          reqData.planFormData.lunchStart,
          reqData.planFormData.lunchEnd,
          reqData.planFormData.dinnerStart,
          reqData.planFormData.dinnerEnd,
          reqData.planFormData.pubTrans,
          reqData.planFormData.walk,
          reqData.planFormData.drive,
          userID,
        ]
      );
      for (let task of reqData.taskFormData) {
        await db.query(
          `INSERT INTO tasks (description, duration, location, remarks, priority, plan_id) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            task.taskDescription,
            task.taskDuration,
            task.taskLocation,
            task.remarks,
            task.priority,
            planID,
          ]
        );
      };

      //gpt ai
      const gptReqString = await prepareRequirements(reqData);
      console.log(gptReqString);
      let gptResult: { role: string, content: string } = await callChatGPT(gptReqString);

      //insert to server
      await db.query(
        `INSERT INTO results (
            plan_id,
            q_content,
            a_content
            ) VALUES ($1, $2, $3)`,
        [
          planID,
          gptReqString,
          gptResult.content
        ]
      );

      //make res for html show
      planButtonData.resultHTML = gptResult.content;

      planButtonData.actionDone = "submitted"
      body = await encrypt(planButtonData);
      // console.log(body);
      res.json({ en: body });
    } else if (reqData.clickButton === "save-btn") {
      planButtonData.actionDone = "saved"
      body = await encrypt(planButtonData);
      // console.log(body);
      res.json({ en: body });
    } else {
      res.json({ okOrSaveSuccess: false });
    };

  } catch (err) {
    console.log("debug la")
    console.log(err);
    res.json(err.message);
  }
});

//if plan exists, update data with current planID
app.put("/forms", async (req: Request, res: Response) => {
  try {
    // current user is who --> his id is?
    let userID = await getUserID("katie");
    // let userID = 1;
    console.log(userID);
    // decrypt
    console.log(req.body);
    let reqBody = await decrypt(req.body.en);
    // let decrypt = CryptoJS.AES.decrypt(req.body, secret, options);
    // console.log(decrypt)
    // let data = decrypt.toString(CryptoJS.enc.Utf8);
    // let reqData = JSON.parse(JSON.stringify(data));
    // console.log("decrypt", reqData);

    let reqData = {
      planFormData: reqBody.planFormData,
      taskFormData: reqBody.taskFormData,
      clickButton: reqBody.clickButton
    };
    console.log(reqData);
    let reqPlanID = reqBody.planID;

    // input to temp table becuase save/ok button also need input to temp table
    await db.query(
      `UPDATE temp SET content = $1 WHERE id = $2`,
      [req.body, reqPlanID]
    );
    console.log("updated temp table");


    // take out the inserted data's id for plan_id
    const result = await db.query(
      `Select id from temp where content=$1`,
      [
        req.body
      ]
    );
    const planID = result.rows[0].id;
    console.log(planID);

    //data for making saved plan button
    let planButtonData = {
      userID: userID,
      planID: planID,
      planName: reqData.planFormData.planName,
      planDate: reqData.planFormData.planDate,
      resultHTML: "",
      actionDone: ""
    };
    let body = "";

    if (reqData.clickButton === "ok-btn") {
      //update data

      // Delete all the plan data for the plan with this ID then insert again the updated data
      await db.query(
        `DELETE FROM plans WHERE plan_id = $1`,
        [planID]
      );
      await db.query(
        `INSERT INTO plans (
            plan_id,
            name,
            date,
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          planID,
          reqData.planFormData.planName,
          reqData.planFormData.planDate,
          reqData.planFormData.startLocation,
          reqData.planFormData.returnLocation,
          reqData.planFormData.startTime,
          reqData.planFormData.endTime,
          reqData.planFormData.lunchStart,
          reqData.planFormData.lunchEnd,
          reqData.planFormData.dinnerStart,
          reqData.planFormData.dinnerEnd,
          reqData.planFormData.pubTrans,
          reqData.planFormData.walk,
          reqData.planFormData.drive,
          userID,
        ]
      );
      // Delete all the tasks for the plan with this ID then insert again the updated data
      await db.query(
        `DELETE FROM tasks WHERE plan_id = $1`,
        [planID]
      );
      for (let task of reqData.taskFormData) {
        await db.query(
          `INSERT INTO tasks (description, duration, location, remarks, priority, plan_id) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            task.taskDescription,
            task.taskDuration,
            task.taskLocation,
            task.remarks,
            task.priority,
            planID,
          ]
        );
      };

      //gpt ai
      const gptReqString = await prepareRequirements(reqData);
      console.log(gptReqString);
      let gptResult: { role: string, content: string } = await callChatGPT(gptReqString);

      //insert to server
      await db.query(
        `INSERT INTO results (
                  plan_id,
                  q_content,
                  a_content
                  ) VALUES ($1, $2, $3)`,
        [
          planID,
          gptReqString,
          gptResult.content
        ]
      );

      //make res for html show
      planButtonData.resultHTML = gptResult.content;

      planButtonData.actionDone = "submitted"
      body = await encrypt(planButtonData);
      // console.log(body);
      res.json({ en: body });
    } else if (reqData.clickButton === "save-btn") {
      planButtonData.actionDone = "saved"
      body = await encrypt(planButtonData);
      // console.log(body);
      res.json({ en: body });
    } else {
      res.json({ okOrSaveSuccess: false });
    };

  } catch (err) {
    console.log("debug la")
    console.log(err);
    res.json(err.message);
  }
});

//when click create new plan, show forms.html
app.post("/create", async (req: Request, res: Response) => {
  try {
    if (req.body.clickButton === "create-btn") {
      res.json({ createSuccess: true });
    } else {
      await res.json({ createSuccess: false });
    };
  } catch (err) {
    console.log("debug la create")
    console.log(err);
    res.json(err.message);
  };
});

// check plan is exist? when click "plan 1- 2023-06-03"
app.get("/search", async (req: Request, res: Response) => {
  try {
    // check user
    let userID = await getUserID("katie");

    //search by id
    const planID = req.query.ID;

    let tempEnData = await db.query(
      `SELECT content FROM temp WHERE temp.id = $1 and temp.user_id = $2`,
      [
        planID,
        userID
      ]
    );
    if (tempEnData.rows.length === 0) {
      res.json({ result: null });
    } else {
      res.json(tempEnData.rows[0].content);
    }

    //search by keywords
    //write code later when search box is made

  } catch (err) {
    console.log("debug la search")
    console.log(err);
    res.json(err.message);
  };
});

// when window onload, check user have mut plans saved before
app.get("/login", async (req: Request, res: Response) => {
  try {
    // check user id
    const userName = req.query.username as string;;
    let userID = await getUserID(userName);

    let tempEnData = await db.query(
      `SELECT id,content FROM temp WHERE temp.user_id = $1`,
      [
        userID
      ]
    );
    if (tempEnData.rows.length === 0) {
      res.json({ resultMsg: false });
    } else {
      let result: {
        result: boolean,
        planID: string,
        encryptedContent: string
      }[] = [];
      for (let i = 0; i < tempEnData.rows.length; i++) {
        result.push({
          result: true,
          planID: tempEnData.rows[i].id,
          encryptedContent: tempEnData.rows[i].content
        })
      };
      res.json({ resultMsg: result });
    }

    //search by keywords
    //write code later when search box is made

  } catch (err) {
    console.log("debug la create saved")
    console.log(err);
    res.json(err.message);
  };
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});



// async function checkIDinTable(table: string, reqPlanID: string) {
//   // check input id from req matching temp table id
//   const result = await db.query(
//     `SELECT * FROM $1 WHERE plan_id = $2`,
//     [table, reqPlanID]
//   );
//   if (result.rowCount === 0) {
//     return false;
//   } else {
//     return true;
//   };
// };