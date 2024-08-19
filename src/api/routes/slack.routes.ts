import express from 'express';

import middleware from '../../common/middleware';
import SlackCommandController from '../controllers/slack.command.controller';
import SlackController from '../controllers/slack.controller';
import SlackInteractiveController from '../controllers/slack.interactive.controller';
import SlackSubscribeController from '../controllers/slack.subscribe.controller';

const router = express.Router();

router.post('/', middleware.checkToken, SlackController);
router.post('/command', middleware.checkToken, SlackCommandController);
router.post('/interactive', middleware.checkToken, SlackInteractiveController);

router.get('/subscribe', SlackSubscribeController);

export default router;
