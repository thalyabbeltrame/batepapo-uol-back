import Joi from 'joi';

import { getParticipantsName } from '../utils/participants.js';

export const validateMessageRequest = async (req) => {
  const participantsName = await getParticipantsName();

  const messageSchema = Joi.object({
    from: Joi.valid(...participantsName).required(),
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.valid('message', 'private_message').required(),
  });

  return messageSchema.validate(req, { abortEarly: false });
};
