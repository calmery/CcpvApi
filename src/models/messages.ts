import { Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'

@Table({
  tableName: 'messages',
  timestamps: true,
  paranoid: true
})
export default class Message extends Model<Message> {
  @PrimaryKey
  @AutoIncrement
	@Column
	id: number

  @AllowNull(false)
	@Column
	title: string

  @AllowNull(false)
	@Column
	message: string

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}
