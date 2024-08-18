import { App } from '@slack/bolt';
import type {
  ChatPostMessageArguments,
  ReactionsAddArguments,
} from '@slack/web-api';

import config from '../config';

// Initializes your app with your bot token and signing secret
const app = new App({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
});

const createMessage = async (payload: ChatPostMessageArguments) => {
  const { client } = app;

  const { ok, error, ts, message } = await client.chat.postMessage(payload);
  if (!ok) {
    throw new Error(`Unable to post message on slack! ${error}`);
  }

  return { ts, message };
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
