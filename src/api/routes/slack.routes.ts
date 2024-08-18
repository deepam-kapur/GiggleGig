import express from 'express';

import SlackCommandController from '../controllers/slack.command.controller';
import SlackController from '../controllers/slack.controller';
import SlackInteractiveController from '../controllers/slack.interactive.controller';

const router = express.Router();

router.post('/', SlackController);
router.post('/command', SlackCommandController);
router.post('/interactive', SlackInteractiveController);

export default router;
