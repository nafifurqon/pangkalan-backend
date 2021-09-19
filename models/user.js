const {
  Model,
} = require('sequelize');

const bcrypt = require('../libs/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { UserProfile } = models;
      this.hasOne(UserProfile, { foreignKey: 'user_id', as: 'user_profile' });
    }

    static encrypt(password) {
      return bcrypt.encrypt(password, 12);
    }

    checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    static async register({ email, password }) {
      const encryptedPassword = this.encrypt(password);

      return this.create({ email, password: encryptedPassword });
    }

    static async authenticate({ email, password }) {
      try {
        const user = await this.findOne({ where: { email } });
        if (!user) return Promise.reject(new Error('User not registered'));

        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid) return Promise.reject(new Error('Wrong password'));

        return Promise.resolve(user);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already registered',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please input a valid email.',
        },
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty.',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};
