import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';

import { database as db } from '../server.js';
import { validateMessageRequest } from '../validators/messagesRequest.js';
import { httpStatus } from '../utils/httpStatus.js';

export const postMessage = async (req, res) => {
  console.log(req.body);
  const { to, text, type } = {
    to: stripHtml(req.body.to).result.trim(),
    text: stripHtml(req.body.text).result.trim(),
    type: stripHtml(req.body.type).result.trim(),
  };
  const user = stripHtml(req.header('user')).result.trim();
  console.log({ to, text, type, user });

  try {
    const { error } = await validateMessageRequest({ from: user, to, text, type });
    if (error) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details[0].message);

    const messageToSend = {
      from: user,
      ...req.body,
      time: dayjs().format('HH:mm:ss'),
    };

    await db.collection('messages').insertOne(messageToSend);
    res.send(httpStatus.CREATED);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getMessage = async (req, res) => {
  const user = stripHtml(req.header('user')).result.trim();
  let { limit } = req.query;

  try {
    const filter = { $or: [{ from: user }, { to: user }, { to: 'Todos' }, { type: 'message' }] };
    const messages = await db.collection('messages').find(filter).toArray();
    limit = parseInt(limit) || messages.length;
    const messagesToSend = [...messages].reverse().slice(0, limit);
    res.status(httpStatus.CREATED).send(messagesToSend.reverse());
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const deleteMessage = async (req, res) => {
  const user = stripHtml(req.header('user')).result.trim();
  const { messageId } = req.params;

  try {
    const _id = new ObjectId(messageId);
    const message = await db.collection('messages').findOne({ _id });
    if (!message) return res.sendStatus(httpStatus.NOT_FOUND);
    if (message.from !== user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    await db.collection('messages').deleteOne({ _id });
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    res.send(err);
  }
};

export const putMessage = async (req, res) => {
  const { to, text, type } = {
    to: stripHtml(req.body.to).result.trim(),
    text: stripHtml(req.body.text).result.trim(),
    type: stripHtml(req.body.type).result.trim(),
  };
  const user = stripHtml(req.header('user')).result.trim();
  const { messageId } = req.params;

  try {
    const { error } = await validateMessageRequest({ from: user, to, text, type });
    if (error) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details[0].message);

    const _id = new ObjectId(messageId);
    const message = await db.collection('messages').findOne({ _id });
    if (!message) return res.sendStatus(httpStatus.NOT_FOUND);
    if (message.from !== user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const messageToSend = {
      from: user,
      ...req.body,
      time: dayjs().format('HH:mm:ss'),
    };
    await db.collection('messages').updateOne({ _id }, { $set: messageToSend });
    res.sendStatus(httpStatus.CREATED);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
