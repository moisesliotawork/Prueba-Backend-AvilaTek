const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const orderCtrl = require("../controllers/order.controller");

// Crear un pedido (requiere autenticación)
router.post("/", auth, orderCtrl.createOrder);

// Obtener historial del usuario autenticado
router.get("/", auth, orderCtrl.getMyOrders);

module.exports = router;
