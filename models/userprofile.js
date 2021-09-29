const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Role } = models;
      this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
    }
  }
  UserProfile.init({
    full_name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
  }, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
  });
  return UserProfile;
};
