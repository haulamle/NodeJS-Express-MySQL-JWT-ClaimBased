import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { UserRole } from "./UserRole";

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    field: "id",
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @HasMany(() => UserRole)
  declare userRoles: UserRole[];
}
