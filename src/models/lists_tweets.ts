import { Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, Default, BelongsTo, ForeignKey } from 'sequelize-typescript'
import List from './lists'
import Tweet from './tweets'

@Table({
  tableName: 'lists_tweets',
  paranoid: true
})
export default class ListTweet extends Model<ListTweet> {
  @PrimaryKey
  @AutoIncrement
	@Column
	id: number

  @AllowNull(false)
  @ForeignKey(() => List)
  @Column
  list_id: number

  @AllowNull(false)
  @ForeignKey(() => Tweet)
  @Column
  tweet_id: number

  @AllowNull(false)
  @Default(false)
	@Column
	is_safe: boolean

  // Association

  @BelongsTo(() => List)
  list: List

  @BelongsTo(() => Tweet)
  tweet: Tweet
}
