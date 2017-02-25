var errors = {};

errors.notFound = function(req, res, next) {
  var err = new Error('Not Found');
  // err.status = 404;
  return res.status(404).json({'error' : {
    message: err.message,
    missingPath: true
  }});
};

errors.unhandledException = function(err, req, res, next) {
  console.error('FAIL!!!:', err, err && err.stack, '\n');
  res.status(err.status || 500);
  return res.json({'error' : {
    message: err.message,
    error: err
  }});
};

module.exports = errors;