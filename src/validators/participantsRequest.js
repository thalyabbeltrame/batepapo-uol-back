import Joi from 'joi';

export const validateParticipantsRequest = async (req) => {
  const participantSchema = Joi.object({
    name: Joi.string().required(),
  });

  return participantSchema.validate(req, { abortEarly: false });
};