const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/user.controller');
const User = require("../models/User");

router.get('/', auth(), rbac('admin'), ctrl.listUsers);
router.delete('/:id', auth(), ctrl.deleteUser); // admin hoặc tự xoá trong controller
// Thêm user (chỉ admin)
router.post("/", auth(), rbac('admin'), ctrl.createUser);
// Cập nhật user (chỉ admin)
router.put("/:id", auth(), rbac('admin'), ctrl.updateUser);


module.exports = router;
