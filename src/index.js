import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import { config as dotenvConfig } from 'dotenv';

import { postParticipant, getParticipants } from './controllers/participantsController.js';
// import { postMessage } from './controllers/messagesController.js';

dotenvConfig();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 5000;

export let database = null;
const mongoClient = new MongoClient(MONGO_URI);
const app = express();
app.use([cors(), json()]);

mongoClient.connect().then(() => {
  database = mongoClient.db('batepapo-uol');
  console.log(chalk.blue(`Connected to database ${chalk.bold.blue(database.databaseName)}`));
});

app.post('/participants', postParticipant);
app.get('/participants', getParticipants);
// app.post('messages', postMessage);

app.listen(PORT, () => {
  console.log(chalk.blue(`Server running on ${chalk.bold.italic(`http://localhost:${PORT}`)}`));
});
