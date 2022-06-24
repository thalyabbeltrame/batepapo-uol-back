import Joi from 'joi';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

import { database as db } from '../index.js';
import { validateMessageBodyAndHeader } from '../validators/messages.js';

export const postMessage = async (req, res) => {
  const { to, text, type } = req.body;
  const from = req.header('user');

  try {
    const { error } = await validateMessageBodyAndHeader({ from, to, text, type });
    if (error) return res.status(422).send(error.details[0].message);

    const messageToSend = {
      from,
      ...req.body,
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
  let { limit } = req.query;

  try {
    const filter = { $or: [{ from: user }, { to: user }, { to: 'Todos' }, { type: 'message' }] };
    const messages = await db.collection('messages').find(filter).toArray();
    limit = parseInt(limit) || messages.length;
    const messagesToSend = [...messages].reverse().slice(0, limit);
    res.status(201).send(messagesToSend.reverse());
  } catch (err) {
    res.sendStatus(500);
  }
};

export const deleteMessage = async (req, res) => {
  const user = req.header('user');
  const messageId = req.params.messageId;
  const _id = new ObjectId(messageId);
  console.log(_id);

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

export const putMessage = async (req, res) => {
  const { to, text, type } = req.body;
  const from = req.header('user');
  const messageId = req.params.messageId;
  const _id = new ObjectId(messageId);

  try {
    const { error } = await validateMessageBodyAndHeader({ from, to, text, type });
    if (error) return res.status(422).send(error.details[0].message);

    const message = await db.collection('messages').findOne({ _id });
    if (!message) return res.sendStatus(404);
    if (message.from !== from) return res.sendStatus(401);

    const messageToSend = {
      from,
      ...req.body,
      time: dayjs().format('HH:mm:ss'),
    };
    await db.collection('messages').updateOne({ _id }, { $set: messageToSend });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
};
