import { App } from '@slack/bolt';
import type {
  ChatPostMessageArguments,
  ReactionsAddArguments,
} from '@slack/web-api';

import config from '../config';
import GG_INVITE from '../config/constants/static/gg_invite';

// Initializes your app with your bot token and signing secret
const app = new App({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
});

const createMessage = async (payload: ChatPostMessageArguments) => {
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

const replyEmoji = async (payload: ReactionsAddArguments) => {
  const { client } = app;

  const { ok, error } = await client.reactions.add(payload);
  if (!ok) {
    throw new Error(`Unable to post reply on slack! ${error}`);
  }
};

export default {
  createMessage,
  replyEmoji,
};
