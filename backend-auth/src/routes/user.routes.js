const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/user.controller');

router.post('/',   auth(), rbac('admin'), ctrl.addUser); //thêm 
router.get('/',    auth(), rbac('admin'), ctrl.listUsers);//lấy ds
router.put('/:id', auth(), rbac('admin'), ctrl.updateUser);//cập nhật
router.delete('/:id', auth(), rbac('admin'), ctrl.deleteUser);//xóa 


module.exports = router;
