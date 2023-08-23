const { mongoose } = require("mongoose");
const setErrors = require("../errors/errors");
const chatMessagesModels = require("../models/chatMessages.models");
const chatReceiver = require("../models/chatReceiver");
const chatRoomMembers = require("../models/chatRoomMembers");
const chatRooms = require("../models/chatRooms");
const rolesModels = require("../models/roles.models");
const usersModels = require("../models/users.models");
let validateData = require("../utils/validate.utils");
const ObjectId = mongoose.Types.ObjectId;


class userController {
    constructor() { }
    async createUser(req, res) {
        try {
            const { first_name, last_name, email, password } = req.body;

            let newArr = [];
            let userData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                roleId: newArr
            }

            const { error } = validateData.validation.validate(userData);
            if (error) {
                res.status(406);
                return res.json(
                    {responseMessage:error.message}
                );
            }
            // let insertRecord = await usersModels.create(userData);
            // if (insertRecord) {
            //     setErrors(res, 200, 'Inserted successfully');
            // } else {
            //     setErrors(res, 500, 'Not Inserted');
            // }

        } catch (error) {
            console.log(error);
        }
    }

    async getUserData(req, res) {
        try {
            const getData = await usersModels.find();
            if (getData) {
                setErrors(res, 200, 'fetched successfully', getData);
            } else {
                setErrors(res, 500, 'Not Inserted');
            }
        } catch (error) {

        }
    }

    async getOneUserData(req, res) {
        try {
            // const getData = await usersModels.findById(req.params.id).populate('roleId', 'role address');
            let id = new mongoose.Types.ObjectId(req.params.id);
            const getData = await usersModels.aggregate([
                {
                    $match: { _id: id }
                },
                {
                    '$lookup': {
                        'from': 'roles',
                        'let': { roleId: '$roleId' },
                        'pipeline': [
                            { '$match': { '$expr': { '$in': ["$_id", "$$roleId"] } } }
                        ],
                        'as': 'roleObjects',
                    }
                },
                // {
                //     $lookup: {
                //         from: 'roles',
                //         localField: 'roleId',
                //         foreignField: '_id',
                //         as: 'myUserData'
                //     }
                // },
                // { $unwind: "$myUserData" },
                // {
                //     $match: {
                //         $or: [
                //             { first_name: { $regex: req.body.first_name } },
                //             { "myUserData.address": { $regex: req.body.first_name } },
                //         ]
                //     }
                // },
                // {
                //     $match: {"myUserData.role": "A"}
                // },
                // { $sort: { "myUserData.address": -1 } },
                {
                    $project: {
                        first_name: '$$ROOT.first_name',
                        last_name: '$$ROOT.last_name',
                        email: '$$ROOT.email',
                        roles: '$roleObjects',
                        isAdmin: {
                            "$cond": {
                                "if": { "$eq": ["$myUserData.role", "A"] },
                                "then": true,
                                "else": false
                            }
                        },
                    }
                }

            ])
            console.log(getData)
            if (getData) {
                setErrors(res, 200, 'fetched successfully', getData);
            } else {
                setErrors(res, 500, 'Not fetched');
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateUserData(req, res) {
        let obj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        }
        try {
            const getData = await usersModels.findByIdAndUpdate(req.params.id, obj, { new: true });
            if (getData) {
                setErrors(res, 200, 'updated successfully', getData);
            } else {
                setErrors(res, 500, 'Not updated');
            }
        } catch (error) {

        }
    }

    async loginUser(req, res) {
        const {email, password} = req.body
        let obj = {
            email: req.body.email,
            password: req.body.password,
        }
        try {
            console.log("first",req.protocol + '://' + req.get('host'))
            let checkEmailExist = await usersModels.find(obj);
            if(checkEmailExist.length == 0){
                setErrors(res, 500, 'Invalid credentials');
            }else{
                let prepareResponse = await usersModels.findOne({email})
                setErrors(res, 200,prepareResponse, 'login successful.');
            }
        } catch (error) {
            console.log("err", error)
        }
    }

    async deleteTableData(req, res) {
        try {
            await chatRoomMembers.deleteMany();
            await chatRooms.deleteMany();
            await chatMessagesModels.deleteMany();
            await chatReceiver.deleteMany();
            setErrors(res, 200,'', 'deleted successful.');
        } catch (error) {
            
        }
    }
    
}

module.exports = userController;