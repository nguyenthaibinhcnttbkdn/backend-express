import { Table, Column, Model, DataType, AfterFind } from "sequelize-typescript";

@Table({ timestamps: true })
export class User extends Model<User> {
  @Column({
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  id: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  refresh_token: string;

  @AfterFind
  static async redefinedData(data, aa) {
    console.log("data", aa);
  }
}
