// @ts-nocheck
import { Op, QueryTypes, Sequelize } from 'sequelize';

import DB from '../db/connections/mixor.db.js';

import Groups from '../db/models/groups.models.js';
import GroupUsers from '../db/models/group_users.models.js';

const getGroup = async (userId) => {
  const group = await Groups.findAll({
    attributes: ['id'],
    include: [{
      model: GroupUsers,
      as: 'sender_group_users',
      on: { '$group.id$': Sequelize.col('sender_group_users.group_id') },
      where: { user_id: userId },
      attributes: [],
    }, {
      model: GroupUsers,
      as: 'group_users',
      on: { '$group.id$': Sequelize.col('group_users.group_id') },
      where: { user_id: { [Op.ne]: userId } },
      attributes: [],
    }],
    where: { status: 'active' },
  });

  return group && group[0];
};

const createWaitingGroup = async (userId) => {
  const group = await Groups.create({ status: 'waiting' });
  await GroupUsers.create({ group_id: group.id, user_id: userId });
  return group.id;
};

const joinGroup = async (userId) => {
  const results = await DB.query(
    `select g.id from groups g join group_users gu on g.id=gu.group_id 
      set status='active' 
    where status='waiting' 
    and not exists (select user_id from group_users where user_id=gu.user_id and 
        group_id in (select group_id from group_users where user_id=:userId)) limit 1`,
    {
      replacements: {
        userId,
      },
      type: QueryTypes.SELECT,
    },
  );

  if (!results.length) {
    const groupId = await createWaitingGroup(userId);
    return { groupId, joined: false };
  }

  // TODO: Fix this
  const [{ group_id: groupId, user_id: receiverId }] = results;
  await GroupUsers.create({ group_id: groupId, user_id: userId });
  return { groupId, joined: true, userId: receiverId };
};

const exitGroup = async (groupId, status = 'inactive') => {
  await Groups.update({ status }, { where: { id: groupId } });
};

export default {
  getGroup,
  joinGroup,
  exitGroup,
};
