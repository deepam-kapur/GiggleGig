import type { Request, Response } from 'express';

import response from '../../common/response';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  const { code } = req.query;

  await slackService.authorizeBot(code);

  const objResponse = response(res);

  return objResponse.success({});
};
