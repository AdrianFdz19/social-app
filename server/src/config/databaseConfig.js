import pkg from 'pg'
import {config} from 'dotenv'
const {Pool} = pkg;

config();

let pool;

if (process.env.NODE_ENV === 'production') {
    pool = null; 
} else {
    pool = new Pool({
        user: 'postgres', 
        database: 'social_app', 
        host: 'localhost', 
        port: 5432, 
        password: '1234'
    })
};

export default pool;