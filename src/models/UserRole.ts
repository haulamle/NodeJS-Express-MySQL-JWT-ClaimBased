import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Role } from "./Role";

@Table({
  tableName: "user_role",
  timestamps: true,
})
export class UserRole extends Model {
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
  })
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "role_id",
  })
  declare roleId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "user_id",
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Role)
  declare role: Role;
}
