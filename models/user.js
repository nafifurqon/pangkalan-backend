const {
  Model,
} = require('sequelize');

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
