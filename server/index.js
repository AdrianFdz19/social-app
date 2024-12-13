import {config} from 'dotenv'
import server from './src/server.js';
config();
const PORT = process.env.PORT;

server.listen(PORT, () => console.log('Server is listening on port: ', PORT));