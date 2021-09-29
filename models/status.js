const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Status.init({
    name: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Status',
    tableName: 'statuses',
  });
  return Status;
};
