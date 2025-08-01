const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// Rutas para cualquier rol de usuario
router.get("/", auth, productCtrl.getAllProducts);

// Rutas protegidas para ADMIN
router.post("/", auth, isAdmin, productCtrl.createProduct);
router.put("/:id", auth, isAdmin, productCtrl.updateProduct);
router.delete("/:id", auth, isAdmin, productCtrl.deleteProduct);

module.exports = router;
