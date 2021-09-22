module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('roles', [
      {
        name: 'Agen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pangkalan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'UMKM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const { Op } = Sequelize;
    await queryInterface.bulkDelete('roles', {
      name: { [Op.in]: ['Agen', 'Pangklan', 'UMKM', 'Admin'] },
    });
  },
};
