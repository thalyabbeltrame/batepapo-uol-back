import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';

import { database as db } from '../server.js';
import { validateMessageRequest } from '../validators/messagesRequest.js';
import { httpStatus } from '../utils/httpStatus.js';

export const insertMessage = async (req, res) => {
  const { to, text, type } = {
    to: stripHtml(req.body.to).result.trim(),
    text: stripHtml(req.body.text).result.trim(),
    type: stripHtml(req.body.type).result.trim(),
  };
  const user = stripHtml(req.header('user')).result.trim();

  try {
    const { error } = await validateMessageRequest({ from: user, to, text, type });
    if (error) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details.map(({ message }) => message));

    const messageToSend = {
      from: user,
      to: to,
      text: text,
      type: type,
      time: dayjs().format('HH:mm:ss'),
    };

    await db.collection('messages').insertOne(messageToSend);
    res.sendStatus(httpStatus.CREATED);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getMessages = async (req, res) => {
  const user = stripHtml(req.header('user')).result.trim();
  const limit = parseInt(req.query.limit) || 0;

  try {
    const filter = { $or: [{ from: user }, { to: { $in: [user, 'Todos'] } }, { type: 'message' }] };
    const messagesToSend = await db.collection('messages').find(filter).hint({ $natural: -1 }).limit(limit).toArray();
    res.status(httpStatus.OK).send(messagesToSend.reverse());
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const deleteMessage = async (req, res) => {
  const user = stripHtml(req.header('user')).result.trim();
  const messageId = new ObjectId(req.params.messageId);

  try {
    const message = await db.collection('messages').findOne({ _id: messageId });
    if (!message) return res.sendStatus(httpStatus.NOT_FOUND);
    if (message.from !== user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    await db.collection('messages').deleteOne({ _id: messageId });
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const updateMessage = async (req, res) => {
  const { to, text, type } = {
    to: stripHtml(req.body.to).result.trim(),
    text: stripHtml(req.body.text).result.trim(),
    type: stripHtml(req.body.type).result.trim(),
  };
  const user = stripHtml(req.header('user')).result.trim();
  const messageId = new ObjectId(req.params.messageId);

  try {
    const { error } = await validateMessageRequest({ from: user, to, text, type });
    if (error) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details.map(({ message }) => message));

    const message = await db.collection('messages').findOne({ _id: messageId });
    if (!message) return res.sendStatus(httpStatus.NOT_FOUND);
    if (message.from !== user) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const messageToSend = {
      from: user,
      to: to,
      text: text,
      type: type,
      time: dayjs().format('HH:mm:ss'),
    };

    await db.collection('messages').updateOne({ _id: messageId }, { $set: messageToSend });
    res.sendStatus(httpStatus.CREATED);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
