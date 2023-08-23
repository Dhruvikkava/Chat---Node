const setErrors = require("../errors/errors");
const rolesModels = require("../models/roles.models");
const usersModels = require("../models/users.models");

const createUser = async(req, res) =>{
    try {
        const {first_name, last_name,email,password} = req.body;        
        const insertRole = await rolesModels.create({
            role: req.body.role,
            address : req.body.address
        })
        if(insertRole){
            let userData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                roleId: insertRole._id
            }
            let insertRecord = await usersModels.create(userData);
            if(insertRecord){
                setErrors(res, 200, 'Inserted successfully');  
            }else{
                setErrors(res, 500, 'Not Inserted');
            }                          
        }else{
            setErrors(res, 500, 'Not Inserted');
        }       
        
    } catch (error) {
        console.log(error);
    }    
}

const getUserData = async(req, res) => {
    try {
        const getData = await usersModels.find();
        if(getData){
            setErrors(res, 200, 'fetched successfully', getData);
        }else{
            setErrors(res, 500, 'Not Inserted');
        }
    } catch (error) {
        
    }
}

const getOneUserData = async(req, res) => {
    try {
        const getData = await usersModels.findById(req.params.id).populate('roleId', 'role address');
        if(getData){
            setErrors(res, 200, 'fetched successfully', getData);
        }else{
            setErrors(res, 500, 'Not fetched');
        }
    } catch (error) {
        
    }
}

const updateUserData = async(req, res) => {
    let obj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    }
    try {
        const getData = await usersModels.findByIdAndUpdate(req.params.id, obj,{new: true});
        if(getData){
            setErrors(res, 200, 'updated successfully', getData);
        }else{
            setErrors(res, 500, 'Not updated');
        }
    } catch (error) {
        
    }
}

module.exports = {createUser,getUserData, getOneUserData,updateUserData}