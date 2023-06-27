import { DataTypes } from 'sequelize';
import sequelize from '../connections/mixor.db.js';

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blocked', 'waiting'),
    allowNull: false,
    defaultValue: 'active',
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
  tableName: 'groups',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_0900_ai_ci',
  engine: 'InnoDB',
});

export default Group;
