let validateData = require("../validators/users.validators");

const joiValidates = (schema)  => {
    return (req, res, next) => {

        let schemaValidate = schema.validate(req.body,{ abortEarly: false })
        if (schemaValidate.error) {
            console.log("schemaValidate",schemaValidate.error.details)
            const validationErrors = schemaValidate.error.details.map(detail => ({[detail.context.key] : detail.message}));
            res.status(422);
            return res.json(
                {responseMessage:validationErrors}
            );
        }else{
            next()
        }
    }
}

module.exports = {joiValidates}