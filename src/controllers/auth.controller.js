const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error en el registro", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Credenciales inválidas" });

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error en el login", error: err.message });
  }
};
