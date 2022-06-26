import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import { config as dotenvConfig } from 'dotenv';

import { removeInactiveParticipants } from './utils/participants.js';
import { participantsRoutes } from './routes/participantsRoutes.js';
import { messagesRoutes } from './routes/messagesRoutes.js';
import { statusRoutes } from './routes/statusRoutes.js';

dotenvConfig();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 5000;
const INTERVAL_15S = 15 * 1000;

export let database = null;
const mongoClient = new MongoClient(MONGO_URI);
const app = express();

app.use(cors());
app.use(json());
app.use('/participants', participantsRoutes);
app.use('/messages', messagesRoutes);
app.use('/status', statusRoutes);

mongoClient.connect().then(() => {
  database = mongoClient.db('batepapo-uol');
  console.log(chalk.blue(`Connected to database ${chalk.bold.blue(database.databaseName)}`));
  setInterval(removeInactiveParticipants, INTERVAL_15S);
});

app.listen(PORT, () => {
  console.log(chalk.blue(`Server running on ${chalk.bold.italic(`http://localhost:${PORT}`)}`));
});
