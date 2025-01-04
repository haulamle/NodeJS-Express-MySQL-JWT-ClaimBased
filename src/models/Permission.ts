import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { RolePermission } from "./RolePermission";

@Table({
  tableName: "permissions",
  timestamps: true,
})
export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare action: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare apiEndpoint: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare apiMethod: string;

  @HasMany(() => RolePermission)
  declare rolePermissions: RolePermission[];
}
