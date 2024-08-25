import type { Request, Response } from 'express';

import slackService from '../../service/slack.service';

export default async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      // Construct the new URL
      const redirectUrl = `https://web.gigglegig.fun/error`;

      // Redirect the request
      return res.redirect(301, redirectUrl);
    }

    if (code) {
      await slackService.authorizeBot(code as string);
    }

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
