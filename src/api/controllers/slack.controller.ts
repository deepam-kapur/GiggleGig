import type { Request, Response } from 'express';

import response from '../../common/response';
import { SLACK_REQUEST_TYPE } from '../../config/constants/common.constants';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  const { challenge, type, event } = req.body;

  const objResponse = response(res);

  switch (type) {
    case SLACK_REQUEST_TYPE.URL_VERIFICATION: {
      return objResponse.data({ statusCode: 200, payload: { challenge } });
    }
    case SLACK_REQUEST_TYPE.EVENT_CALLBACK: {
      await slackService.eventCallback(event);

      return objResponse.success({ statusCode: 200 });
    }
    default: {
      return objResponse.success({ statusCode: 200 });
    }
  }
};
