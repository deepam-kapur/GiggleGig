import { DataTypes } from 'sequelize';
import sequelize from '../connections/mixor.db.js';

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  external_page_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  display_name: {
    type: DataTypes.STRING(255),
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
  tableName: 'pages',
  timestamps: false, // Set to true if you want timestamps
  charset: 'utf8mb4',
  collate: 'utf8mb4_0900_ai_ci',
  engine: 'InnoDB',
});

export default Page;
