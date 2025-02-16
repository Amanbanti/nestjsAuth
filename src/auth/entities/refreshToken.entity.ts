import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from '../../auth/entities/auth.entity';

@Table({ tableName: 'refresh_tokens', timestamps: true })
export class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  token: string; // The refresh token itself

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number; // Associate refresh token with a user

  @BelongsTo(() => User)//each refresh token belongs to a single user
  user: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date; // Expiration date for refresh token

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  revoked: boolean; 
}
