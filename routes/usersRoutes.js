const express = require("express");
const router = express.Router();
const usersController = require("../controllers/UsersController");
const usersValidators = require("../validators/usersValidators");
// const commentsValidater = require('../validators/commentsValidater');
// const commentsController = require("../controllers/CommentsController");
// const bookControllers = require("../controllers/BookController");
// const auth = require('../middleware/Auth');

// router.post('/createUser', usersValidators.createUser, usersController.insertUser);
// router.get('/viewAll', auth,bookControllers.viewAll);

router.post(
  "/registerUser",
  usersValidators.createUser,
  usersController.registerUser
);

router.post("/loginUser",usersValidators.loginUser,usersController.loginUser);

// router.post("/loginUser", usersValidators.loginUser, usersController.loginUser);

// router.post("/bookComment", auth, commentsValidater.commentsBook, commentsController.insertComment);

module.exports = router;
