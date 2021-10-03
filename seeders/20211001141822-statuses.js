module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('statuses', [
      {
        name: 'Success',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Failed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete('roles', {
      name: { [Op.in]: ['Success', 'Pending', 'Failed'] },
    });
  },
};
