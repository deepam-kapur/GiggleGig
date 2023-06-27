import { DataTypes } from 'sequelize';
import sequelize from '../connections/mixor.db.js';

const GroupUser = sequelize.define('GroupUser', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'group_users',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_0900_ai_ci',
  engine: 'InnoDB',
});

export default GroupUser;
