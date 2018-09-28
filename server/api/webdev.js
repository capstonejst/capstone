const router = require('express').Router()
const {Bundle, Campaign, Advertisement} = require ('../db/models')

module.exports = router;

//get all campaigns
router.get('/', async (req, res, next) => {
    try {
        const campaigns = await Campaign.findAll()
        console.log(campaigns)
        res.json(campaigns)
    }catch (err) {
        next(err)
    }
})

//create a new bundle w/ appropriate userId - send bundleId back so we can set state w it
router.post('/bundle', async (req, res, next) => {
    const userId = req.body.userId
    try {
        const newBundle = 
    }catch (err){
        next(err)
    }
})

//get all ads in a campaign -- used for creating script tag
router.get('/:bundleId', async (req, res, next) => {
    const bundleId = req.params.bundleId
    try {
        let adsArr = []        
        const bundle = await Bundle.findById(bundleId, {
            include: [{model: Campaign, include: [{model: Advertisement}]}]
        })
        await bundle.campaigns.map(campaign => {
            campaign.advertisements.map(ad => {
                adsArr.push(ad)
            })
        })
        res.json(adsArr)
    } catch (err) {
        next(err)
    }
})

//used to increment the number of clicks for a specific campaign - will ultimately
//include a function at the end to check # of clicks and perhaps trigger contract to close
//and payment to be sent to webdev
router.post('/campaignId', async (req, res, next) => {
    const campaignId = req.params.campaignId
    try{
        let campaign = await Campaign.findById(campaignId)
        let clicks = campaign.clicks +1
        campaign.clicks = clicks
        campaign = await campaign.save()
        res.json(campaign.clicks)
    }catch (err) {
        next(err)
    }
})