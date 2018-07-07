import { Sequelize, Table, Column, Model, AllowNull, PrimaryKey, HasMany } from 'sequelize-typescript'

import Tweet from './tweets'
import Mention from './mentions'

@Table({
  tableName: 'users',
  paranoid: true
})
export default class User extends Model<User> {
  @PrimaryKey
	@Column(Sequelize.BIGINT)
	id: number

  @AllowNull(false)
	@Column
	name: string

  @AllowNull(false)
	@Column
	screen_name: string

  @AllowNull(true)
	@Column
	description: string

  @AllowNull(true)
	@Column
	url: string

  @AllowNull(false)
	@Column
	followers_count: number

  @AllowNull(false)
	@Column
	friends_count: number

  @AllowNull(false)
	@Column
	statuses_count: number

  @AllowNull(true)
	@Column
	profile_image_url: string

  @AllowNull(true)
	@Column
	profile_background_image_url: string

  @AllowNull(true)
	@Column
	profile_banner_url: string

  @AllowNull(false)
	@Column(Sequelize.DATE)
  created_at: Date

  @HasMany(() => Tweet)
  tweets: Tweet[]

  @HasMany(() => Mention)
  mention: Mention[]
}
