import { config } from "dotenv";
import populateEnv from "populate-env";
import path from "path";
let p = path.join(__dirname, ".env");
config({ path: p });

export const env_config = {
  POSTGRES_DB: "",
  POSTGRES_USER: "",
  POSTGRES_PASSWORD: "",
  POSTGRES_PORT: "",
  CHAT_GPT_TOKEN:"",
  CHAT_GPT_BASE_PATH:"",
  SESSION_SECRET: "",
};

populateEnv(env_config, { mode: "halt" });
console.log(env_config);
