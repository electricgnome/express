'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATEONLY
      },
      contact: {
        type: Sequelize.JSON
      },
      gender: {
        type: Sequelize.BOOLEAN
      },
      marital_status: {
        type: Sequelize.STRING
      },
      occupation: {
        type: Sequelize.STRING
      },
      id_type: {
        type: Sequelize.STRING
      },
      id_number: {
        type: Sequelize.STRING
      },
      adress: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.INTEGER
      },
      tickets: {
        type: Sequelize.INTEGER
      },
      accidents: {
        type: Sequelize.INTEGER
      },
      at_fault: {
        type: Sequelize.BOOLEAN
      },
      pref_lang: {
        type: Sequelize.STRING
      },
      home_owner: {
        type: Sequelize.BOOLEAN
      },
      has_pop: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('customers');
  }
};