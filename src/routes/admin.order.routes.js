const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const orderCtrl = require('../controllers/order.controller');

router.use(auth, isAdmin); // proteger todo con autenticación + rol ADMIN

router.get('/', orderCtrl.getAllOrders);
router.put('/:id', orderCtrl.updateOrderStatus);

module.exports = router;
