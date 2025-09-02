const Joi = require('joi');

const schemas = {
  login: Joi.object({
    employeeId: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    department: Joi.string().required().valid('development', 'marketing', 'content', 'ai', 'management', 'hr')
  }),
  register: Joi.object({
    employeeId: Joi.string().min(3).max(10).required(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    department: Joi.string().required().valid('development', 'marketing', 'content', 'ai', 'management', 'hr'),
    role: Joi.string().valid('employee', 'admin', 'manager', 'management').default('employee')
  }),
  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null).optional(),
    service: Joi.string().valid('software', 'marketing', 'content', 'ai', 'multiple', 'other').optional(),
    message: Joi.string().min(10).max(2000).required()
  }),
  email: Joi.object({
    email: Joi.string().email().required()
  }),
  newsletter: Joi.object({
    subject: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).required(),
    htmlContent: Joi.string().allow('', null).optional()
  })
};

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }
  req.body = value;
  next();
};

module.exports = {
  validateLogin: validate(schemas.login),
  validateRegister: validate(schemas.register),
  validateContact: validate(schemas.contact),
  validateEmail: validate(schemas.email),
  validateNewsletter: validate(schemas.newsletter)
};
