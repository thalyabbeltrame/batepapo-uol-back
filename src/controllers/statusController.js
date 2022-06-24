import { database as db } from '../server.js';
import { getParticipantsName } from '../utils/index.js';

export const postStatus = async (req, res) => {
  const user = req.header('user');
  
  try {
    const participantsName = await getParticipantsName();
    const userExists = participantsName.some((participant) => participant === user);
    if (!userExists) return res.sendStatus(404);
    
    await db.collection('participants').updateOne({ name: user }, { $set: { lastStatus: Date.now() } });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};
