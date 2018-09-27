'use strict'

const db = require('../server/db')
const {
  User,
  Bundle,
  Advertisement,
  Campaign,
  Category,
  Demographic
} = require('../server/db/models')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
      isAdvertiser: true
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      isAdvertiser: false
    })
  ])

  const bundles = await Promise.all([
    Bundle.create({
      projectName: 'Project1'
    }),
    Bundle.create({
      projectName: 'Project2'
    }),
    Bundle.create({
      projectName: 'Project3'
    })
  ])

  const campaigns = await Promise.all([
    Campaign.create({
      blockChainKey: '',
      clicks: 8,
      name: 'Rolex',
      price: '5000.0',
      isActive: true
    }),
    Campaign.create({
      blockChainKey: '',
      clicks: 3,
      name: 'Gucci',
      price: '5000.0',
      isActive: true
    })
  ])

  const category = await Promise.all([
    Category.create({
      name: 'Luxury'
    }),
    Category.create({
      name: 'Fashion'
    }),
    Category.create({
      name: 'Sports'
    })
  ])

  const demographics = await Promise.all([
    Demographic.create({
      name: 'Women'
    }),
    Demographic.create({
      name: 'Men'
    }),
    Demographic.create({
      name: 'Kids'
    })
  ])

  const advertisements = await Promise.all([
    Advertisement.create({
      name: 'Rolex-Ad-1',
      image:
        'http://doghalloweencostumeshop.com/images/thumbnails/pink-wig-for-dogs.jpg',
      url: 'http://google.com',
      adSpecs: 'format1'
    }),
    Advertisement.create({
      name: 'Rolex-Ad-2',
      image:
        'http://doghalloweencostumeshop.com/images/thumbnails/pink-wig-for-dogs.jpg',
      url: 'http://google.com',
      adSpecs: 'format2'
    }),
    Advertisement.create({
      name: 'Rolex-Ad-3',
      image:
        'http://doghalloweencostumeshop.com/images/thumbnails/pink-wig-for-dogs.jpg',
      url: 'http://google.com',
      adSpecs: 'format3'
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
