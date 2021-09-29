const failed = (res, code, message, data) => {
  res.status(code).json({
    status: false,
    message,
    data,
  });
};

const success = (res, code, message, data) => {
  res.status(code).json({
    status: true,
    message,
    data,
  });
};

module.exports = { failed, success };
