const Sequelize = require('sequelize')
const db = require('../db')

const Demographic = db.define('demographic', {
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Demographic
