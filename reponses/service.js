const failed = (data, message) => ({
  data,
  message,
  status: false,
});

const success = (data, message) => ({
  data,
  message,
  status: true,
});

module.exports = { failed, success };
