const setErrors = (res, status, data, text = "") => {
    let response = {
        'ResponseCode' : status,
        'ResponseData' : data,
    }
    if(text != ""){
        response['ResponseText'] = text
    }
    return res.status(status).json(response);
}

module.exports = setErrors;