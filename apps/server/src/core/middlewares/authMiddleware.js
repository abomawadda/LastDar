export function authMiddleware(req, res, next) {
  // Placeholder until Firebase auth verification is wired.
  req.user = null;
  next();
}

