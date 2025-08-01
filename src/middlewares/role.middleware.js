exports.isAdmin = (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    return next();
  }

  return res.status(403).json({ message: "Acceso denegado: solo ADMIN" });
};
