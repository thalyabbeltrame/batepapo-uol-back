import Joi from 'joi';
import dayjs from 'dayjs';

import { database as db } from '../index.js';

export const postParticipant = async (req, res) => {
  const { name } = req.body;

  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = nameSchema.validate({ name });
  if (error) return res.status(422).send(error.details[0].message);

  try {
    const participantAlreadyExists = await db.collection('participants').findOne({ name });
    if (participantAlreadyExists) return res.status(409).send('Participant already exists');

    const participantToSend = {
      name,
      lastStatus: Date.now(),
    };

    const messageToSend = {
      from: name,
      to: 'Todos',
      text: 'entra na sala...',
      type: 'status',
      time: dayjs().format('HH:mm:ss'),
    };

    await db.collection('participants').insertOne(participantToSend);
    await db.collection('messages').insertOne(messageToSend);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const getParticipants = async (_, res) => {
  try {
    const participants = await db.collection('participants').find().toArray();
    res.status(201).send(participants);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const removeInactiveParticipants = async (req, res) => {
  const filter = { lastStatus: { $lt: Date.now() - 10 * 1000 } };

  try {
    const inactiveParticipants = await db.collection('participants').find(filter).toArray();
    if (inactiveParticipants.length !== 0) {
      const newMessage = inactiveParticipants.map(({ name }) => {
        return {
          from: name,
          to: 'Todos',
          text: 'sai da sala...',
          type: 'status',
          time: dayjs().format('HH:mm:ss'),
        };
      });

      await db.collection('participants').deleteMany(filter);
      await db.collection('messages').insertMany(newMessage);
    }
  } catch (error) {}
};
