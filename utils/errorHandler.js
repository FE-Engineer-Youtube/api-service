// Middleware to handle errors
const handleErrors = (res, status, message) => {
  return res.status(status).json({ error: message });
};
