import Config from '../config/index.js';

import PagesService from './pages.svc.js';
import UserService from './user.svc.js';
import GroupsService from './groups.svc.js';
import MessagesService from './messages.svc.js';

import InstagramUtils from '../utils/instagram.utils.js';

const processFirstMessage = () => {
  
}

const commandMessageReply = async (error, userId, groupUserId) => {
  switch (error) {
    case 'exit:no_group_found': {
      break;
    }
    default: {
      break;
    }
  }
};

const processCommand = async (text, userId, groupId, groupUserId) => {
  let replyMessageCode = 'invalid_command';
  const command = text.substring(1);
  if (command === 'exit') {
    if (groupId) {
      await GroupsService.exitGroup(groupId);
      replyMessageCode = 'exit:success';
    } else {
      replyMessageCode = 'exit:no_group_found';
    }
  } else if (command === 'join') {
    if (!groupId) {
      const groupDetails = await GroupsService.joinGroup([userId]);
      if (groupDetails.joined) {
        replyMessageCode = 'join:success';
        groupUserId = groupDetails.userId;
        groupId = groupDetails.groupId;
      } else {
        replyMessageCode = 'join:waiting';
      }
    } else {
      replyMessageCode = 'join:already_exists';
    }
  } else if (command === 'block') {
    if (groupId) {
      await GroupsService.exitGroup(groupId, 'blocked');
      replyMessageCode = 'block:success';
    } else {
      replyMessageCode = 'block:no_group_found';
    }
  }

  return commandMessageReply(replyMessageCode, userId, groupUserId);
};

const processMessage = async (processingData, message, timestamp) => {
  let messageGroupId = null;
  const { is_echo: isEcho, text, mid: externalMessageId } = message;
  const { user: { id: userId }, page: { id: pageId, external_page_id: externalPageId }, justLog } = processingData;
  if (!processingData.justLog && !isEcho) {
    const { id: groupId, group_users: [{ user_id: groupUserId }] } = await GroupsService.getGroup(userId);
    messageGroupId = groupId;

    const isCommand = text.charAt(0) === '/';
    if (isCommand) {
      await processCommand(text, userId, groupId, groupUserId);
    } else if (groupId) {
      await InstagramUtils.sendMessage(externalPageId, groupUserId, text);
    } else {
      await 
    }
  }
  await MessagesService.create(externalMessageId, text, userId, pageId, timestamp, !justLog, messageGroupId);
};

const process = async ({
  sender: { id: sender }, recipient: { id: recipient }, timestamp, message,
}) => {
  console.log(sender, recipient, timestamp, message);

  const [senderPage, receiverPage] = await Promise.all([
    PagesService.getPage(sender),
    PagesService.getPage(recipient),
  ]);

  const processingData = {
    justLog: !!senderPage,
    user: await UserService.processUser(senderPage ? recipient : sender),
    page: senderPage || receiverPage,
  };

  if (message) {
    await processMessage(processingData, message, timestamp);
  }
};

export default {
  process,
};
