import express, {Request, Response, NextFunction} from "express";
import expressSession from "express-session";
import path from "path";
// import formidable from "formidable";
// import {db} from "db.ts";

const app = express();

app.use(
    expressSession({
      secret: "memoWallIsBeingShown",
      resave: true,
      saveUninitialized: true,
    })
  );
  
declare module "express-session" {
    interface SessionData {
      name?: string;
      counter?: number;
    }
  };

app.use((req: Request, res: Response, next: NextFunction) => {
  if(!req.session.counter){
    req.session.counter = 1;
  } else {
    req.session.counter ++; 
  }
  console.log(`Count ${req.session.counter}`)
  const time = new Date();
  console.log(`[${time.toLocaleString()}] Requested ${req.path}`);
  next();
});

// app.get("/", (req, res, next) => {
//   console.log(req.path);
//   next();
// })

app.use(express.static(path.resolve(__dirname, "public")));



// type Memo = {
//   content: string;
// }


// app.post("/memo/",async (req:Request, res:Request):Promise<void>=>{
//   try {
//     let form = await parseFormData(req) as Memo;
//     db.query(`INSERT INTO memo (content,users_id) VALUES ($1, $2)`,[form.content, 1]);
//     res.json({isError:false,errMess:"",data:"Memo added"})
//   } catch (error) {
//     res.json({isError:true,errMEss:error.message, data:null})
//   }
// })

// app.get("/allMemo/",async (req:Request, res:Request):Promise<void>=>{
//   try {
//     let memos = await db.query(`SELECT * FROM memo`);
//     console.log(memos)
//     res.json({isError:false,errMess:"",data:memos})
//   } catch (error) {
//     res.json({isError:true,errMEss:error.message, data:null})
//   }
// })

// app.put("/editingMemo/:id",async (req:Request, res:Request):Promise<void>=>{
//   try {
//     let memoID = req.params.id
//     let form = await parseFormData(req) as Memo;
//     db.query(`UPDATE memo SET content=$1 WHERE id=$2`,[form.content, memoID])
//     res.json({isError:false,errMess:"",data:"Memo edited"})
//   } catch (error) {
//     res.json({isError:true,errMEss:error.message, data:null})
//   }
// })

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve(__dirname, "public/404.html"));
})

const PORT = 2023;

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);    
});