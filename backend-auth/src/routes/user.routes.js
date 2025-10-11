const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/user.controller');

// Thêm user vẫn cần admin
router.post('/', auth(), rbac('admin'), ctrl.addUser);
//router.post('/', ctrl.addUser); // tạm thời

// chỉ admin xem được danh sách
router.get('/', auth(), rbac('admin'), ctrl.listUsers);


// Xóa user vẫn giữ auth, quyền check trong controller nếu muốn
router.delete('/:id', auth(), ctrl.deleteUser); // admin hoặc tự xoá trong controller

// **Cập nhật user - chỉ admin**
router.put('/:id', auth(), rbac('admin'), ctrl.updateUser);

module.exports = router;
