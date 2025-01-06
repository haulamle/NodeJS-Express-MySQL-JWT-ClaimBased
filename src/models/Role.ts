import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { UserRole } from "./UserRole";
import { RolePermission } from "./RolePermission";

@Table({
  tableName: "role",
  timestamps: true,
})
export class Role extends Model {
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare status: boolean;

  @HasMany(() => UserRole)
  declare userRoles: UserRole[];

  @HasMany(() => RolePermission)
  declare rolePermissions: RolePermission[];
}
