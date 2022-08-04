import Joi from 'joi'

const description = Joi.string().required().label('description').messages()

export const validateLogContextInput = Joi.object().keys({ description })
