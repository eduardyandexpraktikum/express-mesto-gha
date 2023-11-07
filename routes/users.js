const userRouter = require('express').Router();

const {
  getUsers, createUser, getUserById, patchMe, patchAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);

userRouter.patch('/users/me', patchMe);
userRouter.patch('/users/me/avatar', patchAvatar);

module.exports = userRouter;
