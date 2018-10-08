const router = require('express').Router()
const { Contract, User, Campaign, PartiesToContract } = require('../db/models')
const { getUser } = require('./helpers')
const { getDeployedBlocks } = require('../../client/components/controller')
const fundsTransfer = require('../../ethereum/fundsTransfer')
const web3 = require('../../ethereum/web3')
module.exports = router

//get open contracts by user id; for payment portal
router.get('/:userid/user', async (req, res, next) => {
  try {
    const userId = req.params.userid
    console.log('userid', userId)
    const contracts = await PartiesToContract.findAll({
      where: {
        userId: userId
      },
      include: [{ model: Contract, where: { status: 'TRUE', paid: 'FALSE' } }]
    })
    res.send(contracts)
  } catch (err) {
    next(err)
  }
})

// get all contracts
//played around w/ to test controller
router.get('/', async (req, res, next) => {
  try {
    const contracts = await Contract.findAll({
      include: [{ model: User, through: 'partiesToContract' }]
    })
    // comment this back in eventually res.json(contracts)
    const blocks = await getDeployedBlocks()
    console.log('blocks', blocks)
    res.json(blocks)
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
    //get webdev etherium address here, as well as contract
    let contractHash = req.params.contractHash
    console.log('contractHash', contractHash)
    let contract = await Contract.findOne({
      where: {
        contractHash: contractHash
      },
      include: [
        {
          model: User,
          through: 'partiesToContract',
          where: { isAdvertiser: false }
        }
      ]
    })
    const contractUsers = contract.users

    if (contract.clickCount === 10 || contract.clickCount > 10) {
      //withdraw funds from contract

      let accounts = await web3.eth.getAccounts(console.log)
      const blocks = await getDeployedBlocks()
      const indexOf = blocks.indexOf(contractHash)
      const currentContract = fundsTransfer(blocks[indexOf]) //for methods
      currentContract.options.address = `${contractHash}`
      const webdevAddress = contractUsers[0].webdevBlockAddress
      console.log('webdev', webdevAddress) //to withdraw to
      //write withdraw method for current contract
      const getBalance = await currentContract.methods.getBalance().call()
      console.log('balance in contract before withdraw', getBalance)
      const withdraw = await currentContract.methods
        .withdraw(webdevAddress, accounts[4])
        .send({
          gas: 3000000,
          from: accounts[0]
        })
      const getBalanceTwo = await currentContract.methods.getBalance().call()

      console.log('balance in contract after withdraw', getBalanceTwo)
      //await withdraw(currentContract, accounts[1], accounts[2], accounts[3])

      //console.log('currentContract', currentContract)
      //come back to this-script tag
      //create new contract here?
    } else {
      contract.increment('clickCount', { by: 1 })
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

router.put('/paid', async (req, res, next) => {
  try {
    const contractHash = req.body.contractHash
    const contract = await Contract.findOne({
      where: {
        contractHash: contractHash
      }
    })
    contract.update({ paid: true })
  } catch (error) {
    console.error(error)
  }
})

// create a new contract
//put the other email here?!
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
