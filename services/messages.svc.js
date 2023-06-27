import { Sequelize } from 'sequelize';

import Messages from '../db/models/messages.models.js';

const create = async (externalMessageId, text, userId, pageId, createdAt, isSender, groupId = null, isPostback = false) => {
  await Messages.create({
    external_id: externalMessageId,
    text,
    user_id: userId,
    page_id: pageId,
    is_sender: isSender,
    group_id: groupId,
    is_postback: isPostback,
    created_at: createdAt,
  });
};

export default {
  create,
};
