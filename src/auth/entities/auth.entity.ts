import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
//Partial<User> When updating a User, you might not provide all fields
export class User extends Model<User, Partial<User>> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
