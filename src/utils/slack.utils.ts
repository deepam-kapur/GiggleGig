import { App } from '@slack/bolt';
import type {
  ChatPostMessageArguments,
  ReactionsAddArguments,
} from '@slack/web-api';

import config from '../config';
import GG_INVITE from '../config/constants/static/gg_invite';
import { Installations } from '../database/entity/Installations';
import cryptoUtils from './crypto.utils';

const authorizeFn = async ({ team_id }) => {
  const installation = await Installations.findOneBy({ team_id });
  // Fetch team info from database
  // Check for matching teamId and enterpriseId in the installations array
  if (installation.team_id === team_id) {
    const decryptedToken = cryptoUtils.encrypt(installation.bot_token);

    // This is a match. Use these installation credentials.
    return {
      // You could also set userToken instead
      botToken: decryptedToken,
      botId: installation.bot_id,
      botUserId: installation.bot_user_id,
    };
  }

  throw new Error('No matching authorizations');
};

const createMessage = async (
  team_id: number,
  payload: ChatPostMessageArguments,
) => {
  const installation = await authorizeFn({ team_id });
  const app = new App({
    token: installation.botToken,
    // authorize: authorizeFn,
    signingSecret: config.SLACK_SIGNING_SECRET,
  });
  const { client } = app;

  try {
    const { ok, error, ts, message } = await client.chat.postMessage(payload);
    if (!ok) {
      throw new Error(`Unable to post message on slack! ${error}`);
    }

    return { ts, message };
  } catch (e) {
    if (
      e.code === 'slack_webapi_platform_error' &&
      e.data.error === 'not_in_channel'
    ) {
      return {
        e: {
          blocks: GG_INVITE.blocks,
        },
      };
    }

    console.log(e);
    throw e;
  }
};

const replyEmoji = async (team_id: number, payload: ReactionsAddArguments) => {
  const installation = await authorizeFn({ team_id });
  const app = new App({
    token: installation.botToken,
    // authorize: authorizeFn,
    signingSecret: config.SLACK_SIGNING_SECRET,
  });
  const { client } = app;

  const { ok, error } = await client.reactions.add(payload);
  if (!ok) {
    throw new Error(`Unable to post reply on slack! ${error}`);
  }
};

const getOAuthAccess = async (code: string) => {
  const app = new App({
    authorize: ({ teamId }) => authorizeFn({ team_id: teamId }),
    signingSecret: config.SLACK_SIGNING_SECRET,
    clientId: config.SLACK_CLIENT_ID,
    clientSecret: config.SLACK_CLIENT_SECRET,
  });

  const response = await app.client.oauth.v2.access({
    client_id: config.SLACK_CLIENT_ID,
    client_secret: config.SLACK_CLIENT_SECRET,
    code,
    redirect_uri: config.SLACK_REDIRECT_URI,
  });

  if (!response.ok) {
    throw new Error(`Unable to authorize on slack! ${response.error}`);
  }

  return response;
};

export default {
  createMessage,
  replyEmoji,
  getOAuthAccess,
};
