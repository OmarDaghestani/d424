// Must run after `protect`, which attaches req.user
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Not authorized as an admin' });
};

export default admin;
