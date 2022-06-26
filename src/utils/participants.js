import { database as db } from '../server.js';

const TIME_10S = 10 * 1000;

export const getParticipantsName = async () => {
  const participants = await db.collection('participants').find().toArray();
  return participants.map((participants) => participants.name);
};

export const removeInactiveParticipants = async () => {
  const filter = { lastStatus: { $lt: Date.now() - TIME_10S } };

  try {
    const inactiveParticipants = await db.collection('participants').find(filter).toArray();
    if (inactiveParticipants.length) {
      const newMessages = inactiveParticipants.map(({ name }) => {
        return {
          from: name,
          to: 'Todos',
          text: 'sai da sala...',
          type: 'status',
          time: dayjs().format('HH:mm:ss'),
        };
      });

      await db.collection('participants').deleteMany(filter);
      await db.collection('messages').insertMany(newMessages);
    }
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
