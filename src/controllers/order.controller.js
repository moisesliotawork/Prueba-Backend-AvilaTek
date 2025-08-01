const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    // Validación básica
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Debes agregar al menos un producto" });
    }

    // Validar duplicados
    const uniqueIds = new Set(items.map((item) => item.product));
    if (uniqueIds.size !== items.length) {
      return res
        .status(400)
        .json({ message: "No puedes repetir productos en un mismo pedido" });
    }

    // Validar cada item
    for (const item of items) {
      if (!item.quantity || item.quantity < 1) {
        return res
          .status(400)
          .json({ message: "La cantidad debe ser al menos 1" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto no encontrado: ${item.product}` });
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Stock insuficiente para: ${product.name}` });
      }
    }

    // Descontar stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: userId,
      items,
      status: "pendiente",
    });
    await order.populate("items.product", "name");

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear pedido", error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user);

    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener pedidos", error: err.message });
  }
};

// Obtener todas las órdenes (solo ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener todas las órdenes",
      error: err.message,
    });
  }
};

// Cambiar estado de un pedido (solo ADMIN)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pendiente", "procesado", "cancelado"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate("items.product", "name");

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar el pedido", error: err.message });
  }
};
