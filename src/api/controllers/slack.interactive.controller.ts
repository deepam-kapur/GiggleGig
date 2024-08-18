import type { Request, Response } from 'express';

import response from '../../common/response';
import {
  EVENT_TYPE,
  SLACK_INTERACTIVE_ACTIONS,
  SLACK_INTERACTIVE_TYPE,
  STATUS,
} from '../../config/constants/common.constants';
import { SLACK_ERROR_MESSAGE } from '../../config/constants/response.constants';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  const { payload } = req.body;
  const {
    type,
    container: { type: container_type, message_ts },
    user: slackUser,
    channel,
    enterprise,
    actions: [action],
  } = JSON.parse(payload);

  const objResponse = response(res);

  if (type !== SLACK_INTERACTIVE_TYPE.BLOCK_ACTIONS) {
    throw new Error(SLACK_ERROR_MESSAGE.WRONG_COMMAND);
  }

  const { id: slack_user_id, team_id: slack_team_id } = slackUser;
  const { name: slack_channel_name, id: slack_channel_id } = channel;
  const { id: slack_enterprise_id } = enterprise || {};

  const authorized = await slackService.authorizeUserData({
    slack_user_id,
    slack_team_id,
    slack_enterprise_id,
    slack_channel_id,
    slack_channel_name,
  });

  const { user, team } = authorized;

  if (!(user?.status === STATUS.ACTIVE)) {
    throw new Error(SLACK_ERROR_MESSAGE.USER_INACTIVE);
  }

  if (!(team?.status === STATUS.ACTIVE)) {
    throw new Error(SLACK_ERROR_MESSAGE.TEAM_INACTIVE);
  }

  if (!(container_type === EVENT_TYPE.MESSAGE)) {
    throw new Error(SLACK_ERROR_MESSAGE.WRONG_CONTAINER_TYPE);
  }

  const { value: actionValue } = action;

  if (!Object.values(SLACK_INTERACTIVE_ACTIONS).includes(actionValue)) {
    throw new Error(SLACK_ERROR_MESSAGE.INTERACTION_WRONG_TYPE);
  }

  await slackService.processBlockAction(actionValue, message_ts, authorized);

  return objResponse.success({});
};
