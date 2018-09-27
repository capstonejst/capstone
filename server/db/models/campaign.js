const Sequelize = require('sequelize')
const db = require('../db')

const Campaign = db.define('campaign', {
  blockChainKey: {
    type: Sequelize.STRING,
    allowNull: false
  },
  clicks: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    defaultValue: 0.0
  },
  metadata: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
})

module.exports = Campaign
