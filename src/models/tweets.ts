import { DataType, Table, Column, Model, AllowNull, PrimaryKey, Default, BelongsTo, HasMany, HasOne, ForeignKey } from 'sequelize-typescript'
import ListTweet from './lists_tweets'
import User from './users'
import Media from './media'
import Mention from './mentions'

@Table({
  tableName: 'tweets',
  paranoid: true
})
export default class Tweet extends Model<Tweet> {
  @PrimaryKey
	@Column
	id: number

  @AllowNull(false)
	@Column
	text: string

  @AllowNull(false)
	@Column
  @ForeignKey(() => User)
	user_id: number

  @AllowNull(false)
  @Default(false)
	@Column
	is_deleted: boolean

  @AllowNull(false)
	@Column
	retweet_count: number

  @AllowNull(false)
	@Column
	favorite_count: number

  @AllowNull(false)
	@Column(DataType.DATE)
  created_at: Date

  // Association

  @HasOne(() => ListTweet)
  lists_tweet: ListTweet

  @BelongsTo(() => User)
  user: User

  @HasMany(() => Media)
  media: Media[]

  @HasMany(() => Mention)
  mentions: Mention[]
}
