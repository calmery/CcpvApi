import { Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'

@Table({
  tableName: 'notifications',
  timestamps: true,
  paranoid: true
})
export default class Notification extends Model<Notification> {
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
