import url from 'url'
import dotenv from 'dotenv'
import config from './config'

dotenv.config()

// Postgres
export const SEQUELIZE_CONFIG = (() => {
  const env = process.env.NODE_ENV || 'development'

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

  if (env === 'production') {
    const databaseUrl = url.parse(process.env.DATABASE_URL!)

    return Object.assign(baseConfig, {
      host: databaseUrl.hostname,
      username: databaseUrl.auth!.split(':')[0],
      password: databaseUrl.auth!.split(':')[1],
      name: databaseUrl.path!.slice(1)
    })
  }

  let extendedConfig = config.development

  if (env === 'test') {
    extendedConfig = config.test
  }

  return Object.assign(baseConfig, {
    host: extendedConfig.host,
    username: extendedConfig.username,
    password: extendedConfig.password,
    name: extendedConfig.database, // Database name
  })
})()

// Firebase
export const PROJECT_ID = process.env.PROJECT_ID
export const PRIVATE_KEY = unescape(process.env.PRIVATE_KEY!)
export const CLIENT_EMAIL = process.env.CLIENT_EMAIL
