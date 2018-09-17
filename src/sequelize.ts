import { Sequelize } from 'sequelize-typescript'
import * as Constants from './constants'

import Account from './models/accounts'
import Message from './models/messages'
import List from './models/lists'
import ListTweet from './models/lists_tweets'
import Tweet from './models/tweets'
import User from './models/users'
import Media from './models/media'
import Mention from './models/mentions'

const sequelize = new Sequelize(Constants.SEQUELIZE_CONFIG)

sequelize.addModels([Account, List, ListTweet, Tweet, User, Media, Mention, Message])

export default sequelize
