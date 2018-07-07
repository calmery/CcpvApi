import { Sequelize, Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Users from './users'
import Tweets from './tweets'

@Table({
  tableName: 'mentions',
  paranoid: true
})
export default class Mentions extends Model<Mentions> {
  @PrimaryKey
  @AutoIncrement
	@Column
	id: number

  @AllowNull(false)
  @ForeignKey(() => Tweets)
	@Column(Sequelize.BIGINT)
	tweet_id: number

  @AllowNull(false)
  @ForeignKey(() => Users)
	@Column(Sequelize.BIGINT)
	user_id: number

  @BelongsTo(() => Tweets)
  tweet: Tweets

  @BelongsTo(() => Users)
  user: Users
}
