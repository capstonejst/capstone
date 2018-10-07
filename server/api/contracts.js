const router = require('express').Router()
const { Contract, User, Campaign, PartiesToContract } = require('../db/models')
const { getUser } = require('./helpers')
module.exports = router

//get open contracts by user id; for payment portal
router.get('/:userid/user', async (req, res, next) => {
  try {
    const userId = req.params.userid
    console.log('userid', userId)
    const contract = await PartiesToContract.findOne({
      where: {
        userId: userId
      },
      include: [{ model: Contract, where: { status: 'TRUE' } }]
    })

    res.send(contract)
  } catch (err) {
    next(err)
  }
})
// get all contracts
router.get('/', async (req, res, next) => {
  try {
    const contracts = await Contract.findAll({
      include: [{ model: User, through: 'partiesToContract' }]
    })
    res.json(contracts)
  } catch (err) {
    next(err)
  }
})

// get contract by id
router.get('/:contractId', async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.contractId)
    if (!contract) res.sendStatus(404)
    else res.send(contract)
  } catch (err) {
    next(err)
  }
})

router.post('/:contractHash', async (req, res, next) => {
  try {
    let contract = await Contract.findOne({
      where: {
        contractHash: req.params.contractHash
      }
    })
    contract.increment('clickCount', { by: 1 })
    if (contract.clickCount === 10 || contract.clickCount > 10) {
      //create new contract here?
    }
  } catch (error) {
    console.error(error)
  }
})
// })
// const contract = await Contract.findAll({
//   where: {
//     contractHash: req.params.contractHash
//   }
// })
// console.log('contract', contract.id)
// contract.update({

// })

// Project.update(

//   // Set Attribute values
//   {
//       title: 'a very different title now'
//   },

//   // Where clause / criteria
//   {
//       _id: 1
//   }

// create a new contract
router.post('/', async (req, res, next) => {
  try {
    const { campaignId, bundleId, contractHash, balance } = req.body
    const newContract = await Contract.create({
      campaignId: campaignId,
      bundleId: bundleId,
      contractHash: contractHash,
      balance: balance
    })

    newContract.addUsers([req.body.devId, req.body.advertiserId])

    const advertiser = await User.findById(req.body.advertiserId)

    if (newContract.balance > advertiser.budget) {
      advertiser.update({ isActive: false })
    } else {
      // update budget
      const updatedBudget = advertiser.budget - newContract.balance
      advertiser.update({ budget: updatedBudget })
    }
    res.json(newContract)
  } catch (err) {
    next(err)
  }
})
