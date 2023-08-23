let validateData = require("../utils/validate.utils");

const validators = function (req, res, next) {
    let userData = req.body? req.body : {}
    let validator  = validateData.validation.validate(userData,{ abortEarly: false });
    console.log("validator",validator.error)
    if (validator.error) {
        const validationErrors = validator.error.details.map(detail => detail.message);
        res.status(406);
        return res.json(
            {responseMessage:validationErrors}
        );
    }else{
        next()
    }
}

module.exports = {validators}