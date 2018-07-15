import express, { Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import firebase from './firebase'

import Sequelize from 'sequelize'
import sequelize from './sequelize'
import Account from './models/accounts'
import List from './models/lists'
import ListTweet from './models/lists_tweets'
import Tweet from './models/tweets'
import User from './models/users'
import Media from './models/media'
import Mention from './models/mentions'

import search from './twitter'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.send('Hello !')
})

interface Request extends express.Request {
  account?: Account
}

// Middleware

const requireApiKey = (request: Request, response: Response, next: NextFunction) => {
  const apiKey = request.headers['x-api-key']

  Account.find({
    where: {
      api_key: {
        [Sequelize.Op.eq]: apiKey
      }
    }
  }).then(account => {
    if (account === null) {
      response.status(401).end()
      return
    }

    request.account = account

    next()
  })
}

app.get('/list', requireApiKey, async (request: Request, response: Response) => {
  try {
    const account = request.account!

    const list = await List.findAll({
      where: {
        account_id: {
          [Sequelize.Op.eq]: account.dataValues.id
        }
      },
      attributes: ['id', 'name', 'query', 'created_at', 'updated_at']
    })

    response.status(200).json(list)
  } catch (_) {
    response.status(500).end()
  }
})

app.post('/list', requireApiKey, async (request: Request, response: Response) => {
  const name = request.body.name
  const query = request.body.query

  if (name === undefined || name === '' || query === undefined || query === '') {
    response.status(400).end()
    return
  }

  const transaction = await sequelize.transaction({
    autocommit: false
  })

  try {
    const account = request.account!

    // Search

    const result = await search(account.access_token, account.access_token_secret, query)
    const statuses = result.statuses

    // Create New List

    const list = List.build({
      account_id: account.dataValues.id,
      name,
      query
    })

    await list.save({
      transaction
    })

    // Insert data of Twitter (ListTweet, Tweet, User, Media, Mention)

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i]

      // Create Or Update User Column
      // 既に存在する場合，値の更新を行う．まだ存在していない場合，値の挿入を行う．

      await User.upsert({
        id: status.user.id,
        name: status.user.name,
        screen_name: status.user.screen_name,
        description: status.user.description,
        url: status.user.url,
        followers_count: status.user.followers_count,
        friends_count: status.user.friends_count,
        statuses_count: status.user.statuses_count,
        profile_image_url: status.user.profile_image_url_https,
        profile_background_image_url: status.user.profile_background_image_url_https,
        profile_banner_url: status.user.profile_banner_url,
        created_at: new Date(status.user.created_at)
      }, {
        transaction
      })

      // Find Or Create Tweet Column
      // 既に存在する場合，挿入しない．まだ存在しない場合，挿入する．

      await Tweet.findOrCreate({
        where: {
          id: status.id
        },
        defaults: {
          id: status.id,
          text: status.text,
          user_id: status.user.id,
          retweet_count: status.retweet_count,
          favorite_count: status.favorite_count,
          created_at: new Date(status.created_at)
        },
        transaction
      })

      // Media and Mention
      // status.entities が存在する場合のみ実行する

      if (status.hasOwnProperty('entities')) {

        const entities = status.entities

        // Media
        // ForEach でエラーが発生する（TypeScript）

        if (entities.hasOwnProperty('media')) {
          for (let i = 0; i < entities.media.length; i++) {
            await Media.findOrCreate({
              where: {
                id: entities.media[i].id
              },
              defaults: {
                id: entities.media[i].id,
                tweet_id: status.id,
                media_url: entities.media[i].url,
                type: entities.media[i].type,
                display_url: entities.media[i].display_url
              },
              transaction
            })
          }
        }

        // Mention

        if (entities.hasOwnProperty('user_mentions')) {
          for (let i = 0; i < entities.user_mentions.length; i++) {
            const mention = entities.user_mentions[i]

            await User.upsert({
              id: mention.id,
              name: mention.name,
              screen_name: mention.screen_name
            }, {
              transaction
            })

            await Mention.upsert({
              name: mention.name,
              tweet_id: status.id,
              user_id: mention.id,
              screen_name: mention.screen_name
            }, {
              transaction
            })
          }
        }
      }

      // Save ListTweet

      await ListTweet.build({
        list_id: list.dataValues.id,
        tweet_id: status.id
      }).save({
        transaction
      })
    }

    await transaction.commit()

    response.status(200).json({
      id: list.id,
      name: list.name,
      query: list.query,
      created_at: list.created_at,
      updated_at: list.updated_at
    })
  } catch (error) {
    transaction.rollback()
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
    } catch (_) {
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
