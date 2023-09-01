import express, {Request, Response} from "express";
import expressSession from "express-session";
import path from "path";
import jsonfile from "jsonfile";
import formidable from "formidable";
import {formParse} from "./utils";
// import {db} from "db.ts";

const form = formidable({
  uploadDir: "public/uploads",
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

interface Record {
  text: string;
  image?: string;
}

interface User {
  username: string;
  password: string;
}

app.post("/login", async (req: Request, res: Response) => {
  const userList: User[] = await jsonfile.readFile(path.resolve(__dirname,"users.json"));
  if(userList.some(user => user.username === req.body.username && user.password === req.body.password)){
    req.session.user = req.body.username;
    console.log("login ok");
    res.status(200).json({ url: "/admin.html" });
  } else {
    console.log("login failed");
    res.status(401).json({ err: "Login failed." });
  }
});

app.get("/logout", async (req, res) => {
  const userList: User[] = await jsonfile.readFile(path.resolve(__dirname,"users.json"));
  if(userList.some(user => user.username === req.session.user)){
    req.session.destroy(() => {
      res.status(200).json({ url: "/" });
    }
    )
    console.log("logged out");
  }
})

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

app.get("/all-memos/", isLoggedIn, async (_, res) => {
  const memos: Record[] = await jsonfile.readFile("memos.json")
  res.json(memos);
});

app.post("/memo", isLoggedIn, async (req, res) => {
  const {fields, files} = await formParse(form, req);
  const memos: Record[]  = await jsonfile.readFile(path.resolve(__dirname,"memos.json"));
  memos.push({
    text: fields.text as string,
    image: (files.image as formidable.File)?.newFilename
  });
  await jsonfile.writeFile(path.resolve(__dirname,"memos.json"), memos, {spaces: 4});
  res.status(200).json(memos[memos.length-1])
});

app.put("/memo/:id", isLoggedIn, async (req, res) => {
  const idx: number = Number(req.params.id);
  const text: string = req.body.text;
  const memos: Record[]  = await jsonfile.readFile(path.resolve(__dirname,"memos.json"));
  memos[idx].text = text;
  await jsonfile.writeFile(path.resolve(__dirname,"memos.json"), memos, {spaces: 4});
  res.status(200).json(memos[idx])
});

app.delete("/memo/:id", isLoggedIn, async (req, res) => {
  const idx: number = Number(req.params.id);
  const memos: Record[]  = await jsonfile.readFile(path.resolve(__dirname,"memos.json"));
  const deletedMemo = memos.splice(idx, 1);
  await jsonfile.writeFile(path.resolve(__dirname,"memos.json"), memos, {spaces: 4});
  res.status(200).json(deletedMemo[0]);
});

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