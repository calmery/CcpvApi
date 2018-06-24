import { Sequelize } from 'sequelize-typescript'
import * as Constants from './constants'
import Users from './models/users'

const sequelize = new Sequelize(Constants.SEQUELIZE_CONFIG)

sequelize.addModels([Users])

export default sequelize
