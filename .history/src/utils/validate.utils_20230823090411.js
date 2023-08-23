const Joi = require('joi')

function validateUser(user)
{
    const JoiSchema = Joi.object({
      
        username: Joi.string()
                  .min(5)
                  .max(30)
                  .required(),
                    
        email: Joi.string()
               .email()
               .min(5)
               .max(50)
               .optional(), 
                 
        date_of_birth: Joi.date()
                       .optional(),
                         
        account_status: Joi.string()
                        .valid('activated')
                        .valid('unactivated')
                        .optional(),
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(user)
}

module.exports = validateUser;