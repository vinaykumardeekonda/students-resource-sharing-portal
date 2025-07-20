export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Server error (Admin check)" });
  }
};
