const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Transaction } = models;
      this.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
      this.belongsTo(Transaction, { foreignKey: 'status', as: 'transaction_status' });
    }
  }
  History.init({
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'statuses',
        key: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    history_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'History',
    tableName: 'histories',
  });
  return History;
};
