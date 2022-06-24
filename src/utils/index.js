import { database as db } from '../index.js';

export const getParticipantsName = async () => {
  const participants = await db.collection('participants').find().toArray();
  const participantsName = participants.map((participants) => participants.name);
  return participantsName;
};

export const removeInactiveParticipants = async () => {
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
