const bcrypt = require('bcrypt');

const encrypt = (text, salt) => bcrypt.hashSync(text, salt);

const compare = (inputText, encryptedText) => bcrypt.compareSync(inputText, encryptedText);

module.exports = { encrypt, compare };
