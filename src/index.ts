import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import firebase from './firebase'

import Sequelize from 'sequelize'
import sequelize from './sequelize'
import Accounts from './models/accounts'
import Notifications from './models/notifications'

import { URL, PORT, NUMBER_OF_NOTIFICATIONS } from './constants'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello !')
})

// お知らせを取得する
// /notification?start=読み飛ばすお知らせの個数
// /notification?start=0（/notification） 初めから
// /notification?start=5 5 個読み飛ばす，6 個目の位置から
app.get('/notification', async (request, response) => {
  try {
    const start = parseInt(request.query.start, 10) || 0

    const notifications = await Notifications.findAll({
      limit: NUMBER_OF_NOTIFICATIONS,
      offset: start,
      order: [
        ['created_at', 'DESC']
      ]
    })

    let next_url = null

    // 取得した通知が limit で指定した値であるとき，まだ通知が存在する可能性があるので次の通知を取得するための URL を返す．
    if (notifications.length === NUMBER_OF_NOTIFICATIONS) {
      next_url = `${URL}/notification?start=${start + NUMBER_OF_NOTIFICATIONS}`
    }

    response.json({
      notifications,
      next_url
    })
  } catch (_) {
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
    app.listen(PORT)
  } catch (error) {
    throw error
  }
})()

export default app
