import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import firebase from './firebase'

import Sequelize from 'sequelize'
import sequelize from './sequelize'
import Account from './models/accounts'

import search from './twitter'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello !')
})

app.post('/create', async (request, response) => {
  const apiKey = request.headers['x-api-key'] // Get Api Key From Headers
  const name = request.body.name
  const query = request.body.query

  if (name === undefined || name === '' || query === undefined || query === '') {
    response.status(400).end()
  }

  try {
    const account = await Account.find({
      where: {
        api_key: {
          [Sequelize.Op.eq]: apiKey
        }
      }
    })

    const result = await search(account!.access_token, account!.access_token_secret, query)

    // Insert
    // updateOnDuplicate オプションを使う

    /*
    const statuses: Status[] = result.statuses.map((status: Twit.Twitter.Status): Status => {
      return { id: 1 }
    })
    */

    response.status(200).json(result)
  } catch (error) {
    response.status(500).end()
  }
})

app.post('/authentication', async (request, response) => {
  const firebaseIdToken = request.body.firebase_id_token
  const accessToken = request.body.access_token
  const accessTokenSecret = request.body.access_token_secret

  if (firebaseIdToken === undefined || accessToken === undefined || accessTokenSecret === undefined) {
    response.status(400).end()
  }

  // Firebase に問い合わせる
  const verified = await firebase.auth().verifyIdToken(firebaseIdToken)

  const alreadyRegistered = await Account.find({
    where: {
      firebase_id: {
        [Sequelize.Op.eq]: verified.uid
      }
    }
  })

  if (alreadyRegistered === null) {
    try {
      const user = Account.build({
        name: verified.name,
        firebase_id: verified.uid,
        access_token: accessToken,
        access_token_secret: accessTokenSecret
      })

      await user.save()

      response.status(200).json({
        id: user.getDataValue('id'),
        name: user.getDataValue('name'),
        api_key: user.getDataValue('api_key')
      })
    } catch (error) {
      response.status(500).end()
    }

    return
  }

  response.status(200).json({
    id: alreadyRegistered.getDataValue('id'),
    name: alreadyRegistered.getDataValue('name'),
    api_key: alreadyRegistered.getDataValue('api_key')
  })
})

// Postgres との同期が完了してからサーバを起動する
const _ = (async () => {
  try {
    await sequelize.sync()
    app.listen(process.env.PORT || 8000)
  } catch (error) {
    throw error
  }
})()

export default app
