import { Sequelize } from 'sequelize-typescript'
import * as Constants from './constants'
import Accounts from './models/accounts'
import Notifications from './models/notifications'

const sequelize = new Sequelize(Constants.SEQUELIZE_CONFIG)

sequelize.addModels([Accounts, Notifications])

export default sequelize
