import { addMinutes } from 'date-fns';
import { Between, In, LessThanOrEqual } from 'typeorm';

import {
  EVENT_SUBTYPE,
  EVENT_TYPE,
  SESSION_STATUS,
  SLACK_COMMAND_TEXT,
  SLACK_INTERACTIVE_ACTIONS,
  STATUS,
} from '../config/constants/common.constants';
import {
  SLACK_ERROR_MESSAGE,
  SLACK_SUCCESS_MESSAGE,
} from '../config/constants/response.constants';
import GG_INFO from '../config/constants/static/gg_info';
import GG_MIDTIME from '../config/constants/static/gg_midtime';
import GG_NO_RESULTS from '../config/constants/static/gg_no_results';
import GG_NO_RESULTS_MIDTIME from '../config/constants/static/gg_no_results_midtime';
import GG_PROMPT from '../config/constants/static/gg_prompt';
import GG_REPLY from '../config/constants/static/gg_reply';
import GG_RESULTS from '../config/constants/static/gg_results';
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
import llmUtils from '../utils/llm.utils';
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
      channel_id: authorizedData.channel.channel_id,
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

  const { ts, e } = await slackUtils.createMessage({
    channel: authorizedData.channel.slack_channel_id,
    blocks,
  });

  if (e) {
    return e;
  }

  const [session] = await Sessions.save([
    {
      thread_ts: ts,
      job_role: jobRole,
      channel_id: authorizedData.channel.channel_id,
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
  try {
    const prompt = GG_PROMPT.replace('@JobRole', sessionUser.session.job_role)
      .replace('@AssignedSkills', sessionUser.assigned_skills)
      .replace('@Response', text);

    const response = await llmUtils.processLLM(prompt);

    const jsonResponse = JSON.parse(response.response);

    sessionUser.score = jsonResponse.score;
    sessionUser.appreciation = jsonResponse.appreciation;

    await sessionUser.save();
  } catch (e) {
    console.log('-----passTheThreadToLLM------', JSON.stringify(e));
  }
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
          channel_id: channelUser.channel_id,
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

  passTheThreadToLLM(sessionUser, text);
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
    relations: ['session'],
    where: {
      user_id: user.user_id,
      session: {
        thread_ts: threadTs,
      },
    },
  });

  if (
    !(
      sessionUser?.session?.status === SESSION_STATUS.IN_PROGRESS ||
      sessionUser?.session?.status === SESSION_STATUS.HALF_TIME
    )
  ) {
    return;
  }

  const channelUser = await ChannelUsers.findOne({
    relations: ['channel'],
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

const processResults = async (sessionId: number) => {
  const sessionUsers = await SessionUsers.find({
    where: {
      session_id: sessionId,
    },
    relations: ['user'],
  });

  const leaderBoard = sessionUsers.reduce((data, sessionUser) => {
    if (!sessionUser.score) {
      return data;
    }

    if (!data[sessionUser.score]) {
      data[sessionUser.score] = [];
    }

    data[sessionUser.score].push(sessionUser.user);

    return data;
  }, {});

  let leadership = 1;

  const leadershipEmojis = [
    '🥇',
    '🥈',
    '🥉',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
  ];

  let leadershipBlock = '';

  for (const score of Object.keys(leaderBoard)) {
    const emoji = leadershipEmojis[leadership - 1];

    const users = leaderBoard[score];

    leadershipBlock += `\n${emoji} - ${users.map((user: Users) => `<@${user.slack_user_id}`)}>`;

    leadership++;
  }

  return { leadershipBlock, sessionExists: !!Object.keys(leaderBoard).length };
};

const completeSession = async (session: Sessions) => {
  const { leadershipBlock, sessionExists } = await processResults(
    session.session_id,
  );

  let blocks;
  if (!sessionExists) {
    blocks = [...GG_NO_RESULTS.blocks];
  } else {
    blocks = [...GG_RESULTS.blocks];

    blocks[1].text.text = blocks[1].text.text.replace(
      '@Results',
      `${leadershipBlock}`,
    );
  }

  await slackUtils.createMessage({
    channel: session.channel.slack_channel_id,
    blocks,
    thread_ts: session.thread_ts,
  });

  await Sessions.update(
    { session_id: session.session_id },
    { status: SESSION_STATUS.COMPLETED },
  );
};

const midSession = async (session: Sessions) => {
  const { leadershipBlock, sessionExists } = await processResults(
    session.session_id,
  );

  let blocks;
  if (!sessionExists) {
    blocks = [...GG_NO_RESULTS_MIDTIME.blocks];
  } else {
    blocks = [...GG_MIDTIME.blocks];

    blocks[3].text.text = blocks[3].text.text.replace(
      '@Results',
      `${leadershipBlock}`,
    );
  }

  await slackUtils.createMessage({
    channel: session.channel.slack_channel_id,
    blocks,
    thread_ts: session.thread_ts,
  });
};

const runCron = async () => {
  // Process sessions in batches of 10
  const batchSize = 10;

  const midSessions = await Sessions.find({
    where: {
      created_at: Between(
        addMinutes(new Date(), -35),
        addMinutes(new Date(), -30),
      ),
      status: SESSION_STATUS.IN_PROGRESS,
    },
    relations: ['channel'],
  });

  for (let i = 0; i < midSessions.length; i += batchSize) {
    const batch = midSessions.slice(i, i + batchSize);

    // Execute midSession for each session_id in the current batch
    await Promise.all(batch.map((session) => midSession(session)));
  }

  const completeSessions = await Sessions.find({
    where: {
      created_at: LessThanOrEqual(addMinutes(new Date(), -60)),
      status: In([SESSION_STATUS.IN_PROGRESS, SESSION_STATUS.HALF_TIME]),
    },
    relations: ['channel'],
  });

  for (let i = 0; i < completeSessions.length; i += batchSize) {
    const batch = completeSessions.slice(i, i + batchSize);

    // Execute completeSession for each session_id in the current batch
    await Promise.all(batch.map((session) => completeSession(session)));
  }
};

export default {
  authorizeUserData,
  processCommand,
  processBlockAction,
  eventCallback,
  runCron,
};
