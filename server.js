import app from './app.js';
import env from './config/env.config.js';
import { connectDB } from './config/db.config.js';

connectDB();

const port = Number(env.SERVER_PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;
