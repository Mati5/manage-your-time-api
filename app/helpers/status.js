const successMessage = { status: 'success' };
const errorMessage = { status: 'error' };
const status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
};

module.exports.successMessage = successMessage;
module.exports.errorMessage = errorMessage;
module.exports.status = status;
