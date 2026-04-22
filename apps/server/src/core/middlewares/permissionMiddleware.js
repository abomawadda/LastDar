export function permissionMiddleware() {
  return (req, res, next) => {
    next();
  };
}

