import { Table, Column, Model, AllowNull, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Tweet from './tweets'

@Table({
  tableName: 'media',
  paranoid: true
})
export default class Media extends Model<Media> {
  @PrimaryKey
	@Column
	id: number

  @AllowNull(false)
	@Column
  @ForeignKey(() => Tweet)
	tweet_id: number

  @AllowNull(false)
	@Column
	media_url: string

  @AllowNull(false)
	@Column
	type: string

  @AllowNull(false)
	@Column
	display_url: string

  // Association

  @BelongsTo(() => Tweet)
  tweet: Tweet
}
