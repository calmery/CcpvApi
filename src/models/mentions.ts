import { Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, BelongsTo, ForeignKey } from 'sequelize-typescript'
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
	@Column
	tweet_id: number

  @AllowNull(false)
  @ForeignKey(() => Users)
	@Column
	user_id: number

  @BelongsTo(() => Tweets)
  tweet: Tweets

  @BelongsTo(() => Users)
  user: Users
}
