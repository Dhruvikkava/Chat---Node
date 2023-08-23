const setErrors = (code, data, text = "") => {
    let response = {
        'ResponseCode' : code,
        'ResponseData' : data,
    }
    if(text != ""){
        response['ResponseText'] = text
    }
    return response;
}