/* eslint-disable linebreak-style */
import Group from './groups.models.js';
import GroupUser from './group_users.models.js';

const initModelsAssociation = () => {
  // Group model
  Group.hasMany(GroupUser, { foreignKey: 'group_id', as: 'sender_group_users' });
  Group.hasMany(GroupUser, { foreignKey: 'group_id', as: 'group_users' });

  // GroupUser model
  GroupUser.belongsTo(Group, { foreignKey: 'group_id', as: 'sender_group' });
  GroupUser.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
};

export default initModelsAssociation;
