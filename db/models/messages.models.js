import { DataTypes } from 'sequelize';
import sequelize from '../connections/mixor.db.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  external_id: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true,
  },
  text: {
    type: DataTypes.STRING(10240),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  page_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  is_sender: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'messages',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_0900_ai_ci',
  engine: 'InnoDB',
});

export default Message;
