import { Sequelize } from 'sequelize-typescript'
import * as Constants from './constants'
import Accounts from './models/accounts'

const sequelize = new Sequelize(Constants.SEQUELIZE_CONFIG)

sequelize.addModels([Accounts])

export default sequelize
