module.exports = function premium(req, res, next) {
  if (!req.user || (req.user.role !== 'premium' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Premium required' });
  }
  next();
}
