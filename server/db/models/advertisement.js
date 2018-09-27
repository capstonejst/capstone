const Sequelize = require('sequelize')
const db = require('../db')

const Advertisement = db.define('advertisement', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    },
    defaultValue: ''
  },
  url: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    },
    allowNull: false
  },
  adSpecs: {
    type: Sequelize.ENUM('format1', 'format2', 'format3')
  }
})

module.exports = Advertisement
