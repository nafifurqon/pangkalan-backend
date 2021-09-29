const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { UserProfile, History } = models;
      this.belongsTo(UserProfile, { foreignKey: 'seller', as: 'seller' });
      this.hasMany(History, { foreignKey: 'transaction_id', as: 'histories' });
    }
  }
  Transaction.init({
    do_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seller: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_profiles',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  });
  return Transaction;
};
