const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");

// Rutas públicas
router.get("/", productCtrl.getAllProducts);

// Rutas protegidas
router.post("/", auth, productCtrl.createProduct);
router.put("/:id", auth, productCtrl.updateProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);

module.exports = router;
