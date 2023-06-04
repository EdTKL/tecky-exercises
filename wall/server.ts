import express, {Request, Response, NextFunction} from "express";
import expressSession from "express-session";
import path from "path";
import jsonfile from "jsonfile";
import formidable from "formidable";
import {formParse} from "./utils";
// import {db} from "db.ts";

const form = formidable({
  uploadDir: "public/upload",
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: (1024 ** 2) * 200,
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({
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
  const time = new Date();
  console.log(`[${time.toLocaleString()}] Count ${req.session.counter} Requested ${req.path}`);
  next();
});

interface Record {
  text: string | string[]
}

app.post("/memo", async (req: Request, res: Response) => {
  const {fields, files} = await formParse(form, req);
  console.log(files)
  const memos: Record[]  = await jsonfile.readFile(path.resolve(__dirname,"memos.json"));
  memos.push({
    text: fields.text
  });
  await jsonfile.writeFile(path.resolve(__dirname,"memos.json"), memos, {spaces: 4});

  res.redirect("/");
})


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