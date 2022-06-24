import Joi from 'joi';

export const validateParticipantsBody = async (req) => {
  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });

  return nameSchema.validate(req);
};
