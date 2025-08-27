function erreurMiddleware(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Erreur serveur",
    details: err.details || null
  });
}

module.exports = erreurMiddleware;
