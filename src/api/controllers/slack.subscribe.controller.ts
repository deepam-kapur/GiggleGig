import type { Request, Response } from 'express';

import response from '../../common/response';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  const { code } = req.query;

  if (code) {
    await slackService.authorizeBot(code as string);
  }

  const objResponse = response(res);

  return objResponse.success({});
};
