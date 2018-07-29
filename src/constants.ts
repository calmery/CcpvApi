import url from 'url'
import dotenv from 'dotenv'

dotenv.config()

// Postgres
export const SEQUELIZE_CONFIG = (() => {
  // Postgres との接続に使用する
  // process.env.DATABASE_URL があるときはそちらをそのまま使用する

  const baseConfig = {
    dialect: 'postgres',
    operatorsAliases: false,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }

  if (process.env.DATABASE_URL) {
    const config = url.parse(process.env.DATABASE_URL)

    return Object.assign(baseConfig, {
      host: config.hostname,
      username: config.auth!.split(':')[0],
      password: config.auth!.split(':')[1],
      name: config.path!.slice(1)
    })
  }

  return Object.assign(baseConfig, {
    host: 'localhost',
    username: '',
    password: '',
    name: 'ccpv' // Database name
  })
})()

// Server URL
export const PORT = process.env.PORT || 8000
export const URL = (() => {
  if (process.env.NODE_ENV === 'production') {
    return `https://ccpv.herokuapp.com`
  }

  // Staging

  // Development
  return `http://localhost:${PORT}`
})()

// Firebase
export const PROJECT_ID = process.env.PROJECT_ID
export const PRIVATE_KEY = unescape(process.env.PRIVATE_KEY!)
export const CLIENT_EMAIL = process.env.CLIENT_EMAIL

// Notifications
export const NUMBER_OF_NOTIFICATIONS = 5

// Twitter
export const CONSUMER_KEY = process.env.CONSUMER_KEY!
export const CONSUMER_SECRET = process.env.CONSUMER_SECRET!
