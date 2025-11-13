const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: "Accès refusé : token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contient id, email, role
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// Middleware pour vérifier que l'utilisateur est admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Accès refusé : Admin uniquement" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// Middleware pour vérifier rôle spécifique (optionnel)
const verifyRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Accès refusé : rôle non autorisé" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  };
};

module.exports = { verifyToken, verifyAdmin, verifyRole };
