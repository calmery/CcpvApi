import { Model, Table, Column, AllowNull, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt, Default, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript'
import Account from './accounts'
import ListsTweets from './lists_tweets'

@Table({
  tableName: 'lists',
  timestamps: true,
  paranoid: true
})
export default class List extends Model<List> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @AllowNull(false)
  @ForeignKey(() => Account)
  @Column
  account_id: number

  @AllowNull(false)
	@Column
	name: string

  @AllowNull(false)
	@Column
	query: string

  @AllowNull(false)
  @Default(false)
	@Column
	is_available: boolean

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @DeletedAt
  deleted_at: Date

  // Association

  @BelongsTo(() => Account)
  account: Account

  @HasMany(() => ListsTweets)
  lists_tweets: ListsTweets[]
}
