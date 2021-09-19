const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (payload) => {
  const secretKey = '18ab84d5ba44441582bbb8ed65cb9b35330781debfe7869f6a08104974b7411be17bfb47439513f9b0dd4a0298d9b08de091537ea93fcc05c1088a192f8ff785';

  const token = jwt.sign(payload, secretKey);
  return token;
};

const isUserExists = async (email) => {
  try {
    const user = User.findOne({
      where: { email },
    });

    if (user) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateToken,
  isUserExists,
};
