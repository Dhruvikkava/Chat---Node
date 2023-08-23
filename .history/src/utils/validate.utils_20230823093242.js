const Joi = require('joi')

const validation = Joi.object({
    first_name: Joi.string()
        .min(5)
        .max(30)
        .required()
        .messages({
            "string.required": "First name is mandatory",
            "string.min": "First name is min mength is 5"
        }),
    last_name: Joi.string()
        .min(5)
        .max(30)
        .required(),
                
    email: Joi.string()
        .email()
        .min(5)
        .max(50)
        .optional(), 
                
    password: Joi.string().min(4).alphanum().required(),
                        
    roleId: Joi.string().required()
})

module.exports = {validation};