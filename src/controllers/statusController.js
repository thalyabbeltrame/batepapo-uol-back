import { database as db } from '../server.js';
import { getParticipantsName } from '../utils/participants.js';
import { httpStatus } from '../utils/httpStatus.js';

export const postStatus = async (req, res) => {
  const user = req.header('user');
  
  try {
    const participantsName = await getParticipantsName();
    const userExists = participantsName.some((participant) => participant === user);
    if (!userExists) return res.sendStatus(httpStatus.NOT_FOUND);
    
    await db.collection('participants').updateOne({ name: user }, { $set: { lastStatus: Date.now() } });
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
