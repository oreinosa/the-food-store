const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const router = require("express").Router();
const { getAllUsers, getUserById, createUser,updateUser, deleteUser } = require('../controllers/user.controller');

router.get('/', auth, isAdmin, getAllUsers);

router.get('/:id', auth, isAdmin, getUserById);

router.post('/', auth, isAdmin, createUser);

router.put('/:id', auth, isAdmin, updateUser)

router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;