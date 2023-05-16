import fs from "fs";
import path from "path";

async function listAllJsRecursive(targetPath: string):{
    try {
        const files = await fs.promises.readdir(targetPath);
        const format = ".js";
        for (let file of files){
            if (file.endsWith(format)){
                console.log(path.join(targetPath, file));
            }
        };
    } catch (err) {
        console.log(err);
    }
};


listAllJsRecursive("/Users/Ed/Documents/Coding/tecky-exercises");

/* 
It should print something like:

/Users/alex/Documents/tecky-exercises/main.js
/Users/alex/Documents/tecky-exercises/001.js
...

*/