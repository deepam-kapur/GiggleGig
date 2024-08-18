import llmUtils from 'src/utils/llm.utils';

import {
  EVENT_SUBTYPE,
  EVENT_TYPE,
  SLACK_COMMAND_TEXT,
  SLACK_INTERACTIVE_ACTIONS,
  STATUS,
} from '../config/constants/common.constants';
import {
  SLACK_ERROR_MESSAGE,
  SLACK_SUCCESS_MESSAGE,
} from '../config/constants/response.constants';
import GG_INFO from '../config/constants/static/gg_info';
import GG_PROMPT from '../config/constants/static/gg_prompt';
import GG_REPLY from '../config/constants/static/gg_reply';
import GG_START from '../config/constants/static/gg_start';
import JOB_ROLES from '../config/constants/static/job_roles';
import JOB_SKILLS from '../config/constants/static/job_skills';
import { Channels } from '../database/entity/Channels';
import { ChannelUsers } from '../database/entity/ChannelUsers';
import { Messages } from '../database/entity/Messages';
import { MessagesHistory } from '../database/entity/MessagesHistory';
import { Sessions } from '../database/entity/Sessions';
import { SessionUsers } from '../database/entity/SessionUsers';
import { Teams } from '../database/entity/Teams';
import { Users } from '../database/entity/Users';
import slackUtils from '../utils/slack.utils';
import type {
  AuthorizeUserDataRequest,
  AuthorizeUserDataResponse,
} from './types/slack.events';

const authorizeUserData = async ({
  slack_user_id,
  slack_team_id,
  slack_enterprise_id,
  slack_channel_id,
  slack_channel_name,
}: AuthorizeUserDataRequest): Promise<AuthorizeUserDataResponse> => {
  // eslint-disable-next-line prefer-const
  let [user, team, channel] = await Promise.all([
    Users.findOneBy({ slack_user_id }),
    Teams.findOneBy({
      slack_team_id,
      slack_enterprise_id,
    }),
    Channels.findOneBy({ slack_channel_id }),
  ]);

  if (!user && team) {
    [user] = await Users.save([{ slack_user_id, team_id: team?.team_id }]);
  }

  if (!channel) {
    [channel] = await Channels.save([
      { slack_channel_id, name: slack_channel_name },
    ]);
  }

  let channelUser = await ChannelUsers.findOneBy({
    user_id: user.user_id,
    channel_id: channel.channel_id,
  });

  if (!channelUser) {
    [channelUser] = await ChannelUsers.save([
      { channel_id: channel.channel_id, user_id: user.user_id },
    ]);
  }

  return { user, team, channel, channelUser };
};

const processMessage = async (
  authorizedData: AuthorizeUserDataResponse,
  session: Sessions,
  ts: string,
  text: string,
) => {
  const [message] = await Messages.save([
    {
      user_id: authorizedData.user.user_id,
      session_id: session.session_id,
      thread_ts: session.thread_ts,
      latest_text: text,
      latest_timestamp: ts,
    },
  ]);

  await MessagesHistory.save([
    {
      ts,
      channel_user_id: authorizedData.channelUser.channel_user_id,
      message_id: message.message_id,
    },
  ]);
};

const processBlockAction = async (
  actionValue: string,
  messageTs: string,
  authorizedData: AuthorizeUserDataResponse,
) => {
  if (actionValue === SLACK_INTERACTIVE_ACTIONS.NO) {
    return;
  }

  const session = await Sessions.findOneBy({ thread_ts: messageTs });
  if (!session) {
    throw new Error(SLACK_ERROR_MESSAGE.SESSION_INVALID);
  }

  const sessionUser = await SessionUsers.findOneBy({
    session_id: session.session_id,
    user_id: authorizedData.user.user_id,
  });

  if (sessionUser) {
    return;
  }

  const blocks = [...GG_REPLY.blocks];

  blocks[1].text.text = blocks[1].text.text.replace(
    '@user',
    `@${authorizedData.user.slack_user_id}`,
  );

  blocks[4].text.text = blocks[4].text.text.replace(
    '@JobRole',
    `@${session.job_role}`,
  );

  const jobSkills = [];

  for (let i = 1; i <= 3; i++) {
    let jobSkill = JOB_SKILLS[Math.floor(Math.random() * JOB_SKILLS.length)];

    if (jobSkills.includes(jobSkill)) {
      jobSkill = JOB_SKILLS[Math.floor(Math.random() * JOB_SKILLS.length)];
    }

    blocks[2].text.text = blocks[2].text.text.replace(
      `@jobSkill${i}`,
      `${jobSkill}`,
    );
    jobSkills.push(jobSkill);
  }

  await SessionUsers.save([
    {
      session_id: session.session_id,
      user_id: authorizedData.user.user_id,
      assigned_skills: jobSkills.join(', '),
    },
  ]);

  const { ts } = await slackUtils.createMessage({
    channel: authorizedData.channel.slack_channel_id,
    mrkdwn: true,
    blocks,
    thread_ts: session.thread_ts,
  });

  await processMessage(
    authorizedData,
    session,
    ts,
    SLACK_INTERACTIVE_ACTIONS.YES,
  );
};

const processCommand = async (
  text: string,
  authorizedData: AuthorizeUserDataResponse,
): Promise<string | any> => {
  if (text === SLACK_COMMAND_TEXT.INFO) {
    const blocks = [...GG_INFO.blocks];

    return { blocks };
  }

  if (text && text !== SLACK_COMMAND_TEXT.START) {
    return SLACK_ERROR_MESSAGE.WRONG_COMMAND;
  }

  const jobRole = JOB_ROLES[Math.floor(Math.random() * JOB_ROLES.length)];

  const blocks = [...GG_START.blocks];

  blocks[0].text.text = blocks[0].text.text.replace(
    '@user',
    `@${authorizedData.user.slack_user_id}`,
  );

  blocks[1].text.text = blocks[1].text.text.replace('@JobRole', `${jobRole}`);

  const { ts } = await slackUtils.createMessage({
    channel: authorizedData.channel.slack_channel_id,
    blocks,
  });

  const [session] = await Sessions.save([
    {
      thread_ts: ts,
      job_role: jobRole,
    },
  ]);

  await processMessage(authorizedData, session, ts, 'STARTING!');

  await processBlockAction(SLACK_INTERACTIVE_ACTIONS.YES, ts, authorizedData);

  return SLACK_SUCCESS_MESSAGE.SUCCESSFULLY_STARTED;
};

const replyEmoji = async (channel: string, ts: string) => {
  const reactionEmojis = [
    'raised_hands',
    'thumbsup',
    'clap',
    'tada',
    'handshake',
    'smile',
    '100',
    'ok_hand',
    'star-struck',
    'fire',
    'rocket',
    'muscle',
    'cool',
    'dart',
    'bulb',
    'speech_balloon',
    'star2',
    'gift',
    'v',
    'champagne',
    'gem',
    'clinking_glasses',
    'unicorn_face',
    'mega',
  ];

  const emoji =
    reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

  await slackUtils.replyEmoji({ channel, name: emoji, timestamp: ts });
};

const passTheThreadToLLM = async (sessionUser: SessionUsers, text: string) => {
  const prompt = GG_PROMPT.replace('@JobRole', sessionUser.session.job_role)
    .replace('@AssignedSkills', sessionUser.assigned_skills)
    .replace('@Response', text);

  const response = await llmUtils.processLLM(prompt);

  await SessionUsers.update(
    {
      session_user_id: sessionUser.session_user_id,
    },
    {},
  );

  sessionUser.score = response.score;
  sessionUser.appreciation = response.appreciation;

  await sessionUser.save();
};

const processMessageType = async (
  event: any,
  user: Users,
  channelUser: ChannelUsers,
  sessionUser: SessionUsers,
): Promise<undefined> => {
  const { subtype, ts, text, client_msg_id, thread_ts } = event;

  const eventSubtype = subtype || 'message';

  let message: Messages;

  const clientMessage = await Messages.findOneBy({
    slack_message_id: client_msg_id,
  });

  switch (eventSubtype) {
    case EVENT_SUBTYPE.MESSAGE: {
      if (clientMessage) {
        return;
      }

      [message] = await Messages.save([
        {
          thread_ts,
          session_id: sessionUser.session_id,
          slack_message_id: client_msg_id,
          user_id: user.user_id,
          latest_text: text,
          latest_timestamp: ts,
        },
      ]);

      break;
    }
    case EVENT_SUBTYPE.MESSAGE_CHANGED: {
      clientMessage.latest_text = text;
      clientMessage.latest_timestamp = ts;

      await clientMessage.save();

      message = clientMessage;
      break;
    }
    default: {
      console.log('eventSubtype not found - ', eventSubtype);

      return;
    }
  }

  await MessagesHistory.save([
    {
      ts,
      channel_user_id: channelUser.channel_user_id,
      message_id: message.message_id,
    },
  ]);

  await passTheThreadToLLM(sessionUser, text);
  await replyEmoji(channelUser.channel.slack_channel_id, ts);
};

const eventCallback = async (event: any): Promise<undefined> => {
  const {
    type,
    user: slack_user_id,
    thread_ts: threadTs,
    channel: slack_channel_id,
  } = event;

  const user = await Users.findOneBy({ slack_user_id });

  if (!(user?.status === STATUS.ACTIVE)) {
    throw new Error(SLACK_ERROR_MESSAGE.USER_INACTIVE);
  }

  const sessionUser = await SessionUsers.findOne({
    relations: ['Sesssion'],
    where: {
      user_id: user.user_id,
      session: {
        thread_ts: threadTs,
      },
    },
  });

  if (!(sessionUser?.session?.status === STATUS.ACTIVE)) {
    return;
  }

  const channelUser = await ChannelUsers.findOne({
    relations: ['Channels'],
    where: {
      user_id: user.user_id,
      channel: {
        slack_channel_id,
      },
    },
  });

  if (!channelUser) {
    return;
  }

  switch (type) {
    case EVENT_TYPE.MESSAGE: {
      await processMessageType(event, user, channelUser, sessionUser);

      break;
    }
    default: {
      // throw new Error('Not Valid Message Type');
    }
  }
};

export default {
  authorizeUserData,
  processCommand,
  processBlockAction,
  eventCallback,
};
