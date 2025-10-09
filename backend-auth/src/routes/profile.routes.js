const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/profile.controller');

router.get('/', auth(), ctrl.getMe);
router.put('/', auth(), ctrl.updateMe);

module.exports = router;
