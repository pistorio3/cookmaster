module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    return res.status(422)
      .json({ err: { code: 'invalid_data', message: err.details[0].message } });
  }

  const errorCodeStatus = {
    invalidData: 422, 
    notFound: 404, 
    alreadyExists: 422, 
  };

  const status = errorCodeStatus[err.code] || 500;

  res.status(status).json({ error: { message: err.message } });
}; 