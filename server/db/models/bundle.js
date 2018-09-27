const Sequelize = require('sequelize')
const db = require('../db')

const Bundle = db.define('bundle', {
  projectName: {
    type: Sequelize.STRING
  }
})

module.exports = Bundle
