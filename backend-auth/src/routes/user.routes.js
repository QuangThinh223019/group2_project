const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/user.controller');

router.get('/', auth(), rbac('admin'), ctrl.listUsers);
router.delete('/:id', auth(), ctrl.deleteUser); // admin hoặc tự xoá trong controller

module.exports = router;
