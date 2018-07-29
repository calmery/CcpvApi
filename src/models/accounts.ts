import { Sequelize, Model, Table, Column, AllowNull, PrimaryKey, AutoIncrement, Unique, CreatedAt, UpdatedAt, DeletedAt, IsUUID, Default, HasMany } from 'sequelize-typescript'
import List from './lists'

@Table({
  tableName: 'accounts',
  timestamps: true,
  paranoid: true
})
export default class Account extends Model<Account> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @AllowNull(false)
	@Column
	name: string

  @AllowNull(false)
  @Unique
	@Column
	firebase_id: string

  @AllowNull(false)
	@Unique
  @IsUUID(4)
  @Default(Sequelize.UUIDV4)
	@Column
	api_key: string

  @AllowNull(false)
  @Unique
  @Column
  access_token: string

  @AllowNull(false)
  @Unique
  @Column
  access_token_secret: string

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date

  // Association

  @HasMany(() => List)
  lists: List[]
}
