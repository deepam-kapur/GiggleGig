import type { Request, Response } from 'express';

import response from '../../common/response';
import { SLACK_COMMAND, STATUS } from '../../config/constants/common.constants';
import { SLACK_ERROR_MESSAGE } from '../../config/constants/response.constants';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  const { channel_id, channel_name, enterprise_id, team_id, user_id, text } =
    req.body;

  let { command } = req.body;

  command = command || SLACK_COMMAND.GG;

  const objResponse = response(res);

  const authorized = await slackService.authorizeUserData({
    slack_user_id: user_id,
    slack_team_id: team_id,
    slack_enterprise_id: enterprise_id,
    slack_channel_id: channel_id,
    slack_channel_name: channel_name,
  });

  const { user, team } = authorized;

  if (!(user?.status === STATUS.ACTIVE)) {
    return objResponse.message({
      message: SLACK_ERROR_MESSAGE.USER_INACTIVE,
    });
  }

  if (!(team?.status === STATUS.ACTIVE)) {
    return objResponse.message({
      message: SLACK_ERROR_MESSAGE.TEAM_INACTIVE,
    });
  }

  let replyMessage: string;

  switch (command) {
    case SLACK_COMMAND.GG: {
      replyMessage = await slackService.processCommand(text, authorized);
      break;
    }
    default: {
      replyMessage = SLACK_ERROR_MESSAGE.WRONG_COMMAND;
    }
  }

  return objResponse.message({
    message: replyMessage || SLACK_ERROR_MESSAGE.WRONG_COMMAND,
  });
};
