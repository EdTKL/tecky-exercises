import express, {Request, Response} from "express";
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
  filename: (originalName, originalExt, part) => {
    let timestamp = Date.now()
    let ext = part.mimetype?.split('/').pop()
    return `image-${timestamp}.${ext}`
  }
})

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
      counter?: number;
      user?: string;
    }
  };

  // COUNTER AND REQUESTED PATHS //
// app.use((req: Request, _, next: NextFunction) => {
//   if(!req.session.counter){
//     req.session.counter = 1;
//   } else {
//     req.session.counter ++; 
//   }
//   const time = new Date();
//   console.log(`[${time.toLocaleString()}] Count ${req.session.counter} Requested ${req.path}`);
//   next();
// });

interface Record {
  text: string;
  image?: string;
}

interface User {
  username: string;
  password: string;
}

app.post("/login", async (req, res) => {
  const userList: User[] = await jsonfile.readFile(path.resolve(__dirname,"users.json"));
  if(userList.some(user => user.username === req.body.username && user.password === req.body.password)){
    req.session.user = req.body.username;
    console.log("login succeeded");
    res.redirect(path.resolve(__dirname,"/admin.html"));
  } else {
    console.log("login failed");
    res.redirect("/");
  }
})

app.post("/logout", async (req, res) => {
  const userList: User[] = await jsonfile.readFile(path.resolve(__dirname,"users.json"));
  if(userList.some(user => user.username === req.session.user)){
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    }
    )
    console.log("logout succeeded");
  }
})

app.post("/memo", async (req: Request, res: Response) => {
  const {fields, files} = await formParse(form, req);
  const memos: Record[]  = await jsonfile.readFile(path.resolve(__dirname,"memos.json"));
  memos.push({
    text: fields.text as string,
    image: (files.image as formidable.File)?.newFilename
  });
  await jsonfile.writeFile(path.resolve(__dirname,"memos.json"), memos, {spaces: 4});
  res.redirect("/");
});


app.get("/all-memos/", async (req, res) => {
  const memos: Record[] = await jsonfile.readFile("memos.json")
  res.json(memos);
});


app.use(express.static(path.resolve(__dirname, "public")));


const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session?.user) {
    console.log(req.session);
    //called Next here
    next();
  } else {
    // redirect to index page
    res.redirect("/");
  }
};

// admin.html should be inside protected
app.use(isLoggedIn, express.static("protected"));


app.use((_, res) => {
  res.status(404);
  res.sendFile(path.resolve(__dirname, "public/404.html"));
})


const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);    
});