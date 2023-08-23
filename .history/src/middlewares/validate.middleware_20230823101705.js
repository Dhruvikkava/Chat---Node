let validateData = require("../validators/users.validators");

const joiValidates = (schema)  => {
    return (req, res, next) => {

        let schemaValidate = schema.validate(req.body,{ abortEarly: false })
        console.log("schemaValidate",schemaValidate.error.details)
        if (schemaValidate.error) {
            const validationErrors = schemaValidate.error.details.map(detail => {detail.context.key : detail.message});
            res.status(406);
            return res.json(
                {responseMessage:validationErrors}
            );
        }else{
            next()
        }
        // let userData = req.body? req.body : {}
        // let validator  = validateData.validation.validate(userData,{ abortEarly: false });
        // console.log("validator",validator.error)
        // if (validator.error) {
        //     const validationErrors = validator.error.details.map(detail => detail.message);
        //     res.status(406);
        //     return res.json(
        //         {responseMessage:validationErrors}
        //     );
        // }else{
        //     next()
        // }
    }
}

module.exports = {joiValidates}