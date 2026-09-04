const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: { message: 'Something went wrong!', code: 'INTERNAL_SERVER_ERROR' } });
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, error: { message: 'Route not found', code: 'NOT_FOUND' } });
};

module.exports = { errorHandler, notFound };
