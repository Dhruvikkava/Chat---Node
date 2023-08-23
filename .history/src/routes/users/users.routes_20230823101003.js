const express = require('express');
const userController = require('../../controllers/users.controllers');
const { joiValidates } = require('../../middlewares/validate.middleware');
const { validation } = require('../../validators/users.validators');
const router = express.Router();

const myController = new userController();

router.post("/insert_user", joiValidates(validation), myController.createUser);
router.get("/getAll_user", myController.getUserData);
router.post("/getOne_user/:id", myController.getOneUserData);
router.post("/update_user/:id", myController.updateUserData);
router.post("/login", myController.loginUser);
router.get("/deleteTableData", myController.deleteTableData);

module.exports = router;