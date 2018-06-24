import { Sequelize, Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, Unique, CreatedAt, UpdatedAt, IsUUID, Default } from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true
})
export default class Users extends Model<Users> {
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
  createdAt: Date

  @UpdatedAt
  updatedAt: Date
}
