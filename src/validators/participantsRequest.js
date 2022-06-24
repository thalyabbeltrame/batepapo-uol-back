import Joi from 'joi';

export const validateParticipantsRequest = async (req) => {
  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });

  return nameSchema.validate(req);
};