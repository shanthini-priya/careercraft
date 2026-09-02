export const errorHandler = (err, req, res, _next) => {
  console.error("Error:", err);

  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({
      error: "Conflict",
      message: `A record with this ${field} already exists`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Not found",
      message: "The requested resource was not found",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  if (err.name === "ValidationError" || err.type === "validation") {
    return res.status(400).json({
      error: "Validation error",
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  return res.status(statusCode).json({
    error: "Error",
    message,
  });
};
