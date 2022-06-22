import { database as db } from '../index.js';

export const getParticipantsName = async () => {
  const participants = await db.collection('participants').find().toArray();
  const participantsName = participants.map((participants) => participants.name);
  return participantsName;
};
