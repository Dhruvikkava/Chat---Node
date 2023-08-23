const Joi = require('joi')

function validateUser(user)
{
    const JoiSchema = Joi.object({
      
        first_name: Joi.string()
            .min(5)
            .max(30)
            .required(),
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

    }).options({ abortEarly: false });
  
    return JoiSchema.validate(user)
}

const validation = Joi.object({
    first_name: Joi.string()
        .min(5)
        .max(30)
        .required(),
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

module.exports = validateUser,validation;