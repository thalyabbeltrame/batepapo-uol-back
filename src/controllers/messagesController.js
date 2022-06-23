import Joi from 'joi';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

import { database as db } from '../index.js';
import { getParticipantsName } from '../utils/index.js';

export const postMessage = async (req, res) => {
  const { to, text, type } = req.body;
  const from = req.header('user');

  const participantsName = await getParticipantsName();
  const messageSchema = Joi.object({
    from: Joi.valid(...participantsName).required(),
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.valid('message', 'private_message').required(),
  });

  const { error } = messageSchema.validate({ from: from, to, text, type });

  if (error) return res.status(422).send(error.details[0].message);

  try {
    const messageToSend = {
      from,
      to,
      text,
      type,
      time: dayjs().format('HH:mm:ss'),
    };
    await db.collection('messages').insertOne(messageToSend);
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const getMessage = async (req, res) => {
  const user = req.header('user');
  const limit = parseInt(req.query.limit);

  try {
    const filter = { $or: [{ from: user }, { to: user }, { to: 'Todos' }] };
    const messages = await db.collection('messages').find(filter).toArray();
    const messagesToSend = limit ? [...messages].reverse().slice(0, limit) : [...messages].reverse();
    res.status(201).send(messagesToSend.reverse());
  } catch (err) {
    res.sendStatus(500);
  }
};

export const deleteMessage = async (req, res) => {
  const user = req.header('user');
  const messageId = req.params.id;
  const _id = new ObjectId(messageId);

  try {
    const message = await db.collection('messages').findOne({ _id });
    if (!message) return res.sendStatus(404);
    if (message.from !== user) return res.sendStatus(401);

    await db.collection('messages').deleteOne({ _id });
    res.sendStatus(200);
  } catch (err) {
    res.send(err);
  }
};
