import {Client} from 'pg';
import { env_config } from './env';

export const db = new Client ({
    database:env_config.POSTGRES_DB,
    user:env_config.POSTGRES_USER,
    password:env_config.POSTGRES_PASSWORD,
    port:Number(env_config.POSTGRES_PORT),
})

db.connect().catch(err => {
    console.error('Failed to connect with Database', err);
})