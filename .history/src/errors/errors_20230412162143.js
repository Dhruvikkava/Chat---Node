const setErrors = (res, code, data, text = "") => {
    let response = {
        'ResponseCode' : code,
        'ResponseData' : data,
    }
    if(text != ""){
        response['ResponseText'] = text
    }
    return response;
}

module.exports = setErrors;