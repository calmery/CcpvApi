import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import firebase from './firebase'

import Sequelize from 'sequelize'
import sequelize from './sequelize'
import Accounts from './models/accounts'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello !')
})

app.get('/notification', (request, response) => {
  response.json([
    {
      id: 1,
      title: 'Notification 1',
      message: 'Notification Message 1'
    },
    {
      id: 2,
      title: 'Notification 2',
      message: 'Notification Message 2'
    },
    {
      id: 3,
      title: 'Notification 3',
      message: 'Notification Message 3'
    },
    {
      id: 4,
      title: 'Notification 4',
      message: 'Notification Message 4'
    },
    {
      id: 5,
      title: 'Notification 5',
      message: 'Notification Message 5'
    }
  ])
})

app.get('/list', (request, response) => {
  response.json([
    {
      id: 1,
      name: 'List 1',
      query: 'Query 1'
    },
    {
      id: 2,
      name: 'List 2',
      query: 'Query 2'
    },
    {
      id: 3,
      name: 'List 3',
      query: 'Query 3'
    },
    {
      id: 4,
      name: 'List 4',
      query: 'Query 4'
    },
    {
      id: 5,
      name: 'List 5',
      query: 'Query 5'
    }
  ])
})

app.post('/list', (request, response) => {
  const name = request.body.name
  const query = request.body.query

  if (name === undefined || query === undefined) {
    response.status(400).end()
  }

  response.json({
    id: 5,
    name,
    query,
  })
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

  const alreadyRegistered = await Accounts.find({
    where: {
      firebase_id: {
        [Sequelize.Op.eq]: verified.uid
      }
    }
  })

  if (alreadyRegistered === null) {
    try {
      const user = Accounts.build({
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
