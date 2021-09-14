const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  removeUser,
  addFriend,
  removeFriend
} = require('../../controllers/user-controller');

router.route('/')
  .get(getAllUsers)
  .post(addUser);

router.route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(removeUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;