'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accounts', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      firebase_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      api_key: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
      },
      access_token: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      access_token_secret: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('accounts');
  }
}
