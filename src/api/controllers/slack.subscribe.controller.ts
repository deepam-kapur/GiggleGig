import type { Request, Response } from 'express';

import response from '../../common/response';
import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (code) {
      await slackService.authorizeBot(code as string);
    }

    response(res);

    // Construct the new URL
    const redirectUrl = `https://web.gigglegig.fun/installed`;

    // Redirect the request
    return res.redirect(301, redirectUrl);
  } catch (e) {
    console.log('Subscribe Error - ', e);

    // Construct the new URL
    const redirectUrl = `https://web.gigglegig.fun/error`;

    // Redirect the request
    return res.redirect(301, redirectUrl);
  }
};
