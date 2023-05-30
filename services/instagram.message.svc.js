/* eslint-disable no-unused-expressions */
import Config from '../config/index.js';

import PagesService from './pages.svc.js';
import UserService from './user.svc.js';
import GroupsService from './groups.svc.js';
import MessagesService from './messages.svc.js';

import InstagramUtils from '../utils/instagram.utils.js';
import ErrorHelper from '../helpers/error.helpers.js';

import MessageTemplatesConstants from '../config/constants/message.templates.constants.js';
import { COMMON_ERROR_MESSAGE, STATUS_CODES } from '../config/constants/common.constants.js';

const internalProcessMessage = async (externalPageId, userId, message) => {
  const { text, template } = message;
  let payload;
  if (text) {
    payload = { text };
  } else if (template) {
    payload = MessageTemplatesConstants[template];
    if (!payload) {
      throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }

  await InstagramUtils.sendMessage(externalPageId, userId, payload);
};

const commandMessageReply = async (message, userId, groupUserId, externalPageId) => {
  const receiverMessages = [];
  const senderMessages = [];
  switch (message) {
    case 'exit:no_group_found': {
      senderMessages.push({ text: 'Exit not possible! You are not in any group bro. 😀' });
      senderMessages.push({ template: 'standard' });
      break;
    }
    case 'exit:success': {
      senderMessages.push({ text: 'Exit done. We hope you enjoyed! 😉' });
      senderMessages.push({ template: 'standard' });
      receiverMessages.push({ text: 'Your mixor friend Just left! Please join mixor again to have fun. 😅' });
      break;
    }
    case 'join:waiting': {
      senderMessages.push({
        text: `You are in our waiting list. 🛌 \n
                                We are finding a nice stranger for you.\n Just be ready! Someone is coming. 😍`,
      });
      break;
    }
    case 'join:success': {
      senderMessages.push({
        text: `You are in mixor. You can now chat with your mixor friend! 😎 \n
                                  Please remember your mixor friend may not be comfortable in reveling identity. 
                                  So, don't ask again and again. This is an anonymous mixor community. So just talk and enjoy! 😇`,
      });
      receiverMessages.push({
        text: `You are in mixor. You can now chat with your mixor friend! 😎 \n
                                  Please remember your mixor friend may not be comfortable in reveling identity. 
                                  So, don't ask again and again. This is an anonymous mixor community. So just talk and enjoy! 😇`,
      });
      break;
    }
    case 'block:success': {
      senderMessages.push({
        text: `We've successfully blocked the person you were talking to. Thank you for your feedback.\n
                                  Sorry for your bad experience. You can give us the feedback in next comment. \n
                                  You can join again by clicking ☰ on top right!`,
      });
      receiverMessages.push({
        text: `You have been blocked. That is suspicious 🫤. 
                                    We will look into this matter. Read our community guidelines by clicking menu on top right looks like ☰.
                                    Mixor is a safe community for strangers to connect. So please help us to maintain its credibility!`,
      });
      break;
    }
    case 'block:no_group_found': {
      senderMessages.push({ text: 'Exit not possible! You are not in any group bro. 😀' });
      senderMessages.push({ template: 'standard' });
      break;
    }
    case 'terms': {
      senderMessages.push({ template: 'terms' });
      break;
    }
    case 'Mixor': {
      senderMessages.push({ template: 'mixor' });
      break;
    }
    case 'invalid_command': {
      senderMessages.push({ text: 'What are you trying to do bro? Its wrong command. 😦' });
      senderMessages.push({ template: 'standard' });
      break;
    }
    default: {
      break;
    }
  }

  const promises = [];
  promises.concat(senderMessages.map((senderMessage) => internalProcessMessage(externalPageId, userId, senderMessage)));
  promises.concat(receiverMessages.map((receiverMessage) => internalProcessMessage(externalPageId, groupUserId, receiverMessage)));

  await Promise.all(promises);
};

const processCommand = async (command, userId, groupId, groupUserId, externalPageId) => {
  let replyMessageCode = 'invalid_command';
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
  } else if (command === 'terms') {
    replyMessageCode = 'terms';
  } else if (command === 'mixor') {
    replyMessageCode = 'mixor';
  }

  return commandMessageReply(replyMessageCode, userId, groupUserId, externalPageId);
};

const processMessage = async (processingData, message, timestamp) => {
  const { is_echo: isEcho, text, mid: externalMessageId } = message;
  const {
    user: { id: userId }, page: { id: pageId, external_page_id: externalPageId }, justLog, group,
  } = processingData;
  const { group_id: groupId, group_user_id: groupUserId } = group;
  if (!processingData.justLog && !isEcho) {
    const isCommand = text.charAt(0) === '/';
    if (isCommand) {
      const command = text.substring(1);
      await processCommand(command, userId, groupId, groupUserId, externalPageId);
    } else if (groupId) {
      await InstagramUtils.sendMessage(externalPageId, groupUserId, text);
    } else {
      await commandMessageReply('standard', userId, groupUserId, externalPageId);
    }
  }
  await MessagesService.create(externalMessageId, text, userId, pageId, timestamp, !justLog, groupId);
};

const processPostback = async (processingData, message, timestamp) => {
  const { payload, mid: externalMessageId } = message;
  const {
    user: { id: userId }, page: { id: pageId, external_page_id: externalPageId }, justLog, group,
  } = processingData;
  const { group_id: groupId, group_user_id: groupUserId } = group;
  await MessagesService.create(externalMessageId, payload, userId, pageId, timestamp, !justLog, groupId, true);
};

const process = async ({
  sender: { id: sender }, recipient: { id: recipient }, timestamp, message, postback,
}) => {
  console.log(sender, recipient, timestamp, message);

  const [senderPage, receiverPage] = await Promise.all([
    PagesService.getPage(sender),
    PagesService.getPage(recipient),
  ]);

  const user = await UserService.processUser(senderPage ? recipient : sender);

  const processingData = {
    justLog: !!senderPage,
    user,
    page: senderPage || receiverPage,
    group: null,
  };

  const group = await GroupsService.getGroup(user.user_id);
  if (group) {
    const { id: groupId, group_users: [{ user_id: groupUserId }] } = group;
    processingData.group = {
      group_id: groupId,
      group_user_id: groupUserId,
    };
  }

  if (message) {
    await processMessage(processingData, message, timestamp);
  } else if (postback) {
    await processPostback(processingData, postback, timestamp);
  }
};

export default {
  process,
};
