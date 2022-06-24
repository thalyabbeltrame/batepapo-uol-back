import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import { config as dotenvConfig } from 'dotenv';

import { removeInactiveParticipants } from './utils/index.js';
import { participantsRoute } from './routes/participantsRoute.js';
import { messagesRoute } from './routes/messagesRoute.js';
import { statusRoute } from './routes/statusRoute.js';

dotenvConfig();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 5000;
const INTERVAL_15S = 15 * 1000;

export let database = null;
const mongoClient = new MongoClient(MONGO_URI);
const app = express();

app.use(cors(), json());
app.use(participantsRoute, messagesRoute, statusRoute);

mongoClient.connect().then(() => {
  database = mongoClient.db('batepapo-uol');
  console.log(chalk.blue(`Connected to database ${chalk.bold.blue(database.databaseName)}`));
  // setInterval(removeInactiveParticipants, INTERVAL_15S);
});

app.listen(PORT, () => {
  console.log(chalk.blue(`Server running on ${chalk.bold.italic(`http://localhost:${PORT}`)}`));
});
