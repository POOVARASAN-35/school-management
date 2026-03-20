const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Debug log (optional but useful)
    console.log("🔐 Role check:", req.user.role, "Allowed:", allowedRoles);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export default roleMiddleware;
