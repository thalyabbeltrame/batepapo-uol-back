import dayjs from 'dayjs';
import { stripHtml } from 'string-strip-html';

import { database as db } from '../server.js';
import { validateParticipantsRequest } from '../validators/participantsRequest.js';
import { httpStatus } from '../utils/httpStatus.js';

export const insertParticipant = async (req, res) => {
  const name = stripHtml(req.body.name).result.trim();

  try {
    const { error } = await validateParticipantsRequest({ name });
    if (error) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details.map(({ message }) => message));

    const participantAlreadyExists = await db.collection('participants').findOne({ name });
    if (participantAlreadyExists) return res.sendStatus(httpStatus.CONFLICT);

    const participantToSend = {
      name: name,
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
    res.sendStatus(httpStatus.CREATED);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getParticipants = async (_, res) => {
  try {
    const participants = await db.collection('participants').find().toArray();
    res.status(httpStatus.OK).send(participants);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};