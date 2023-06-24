import express from 'express';
import WebhookCtrl from '../controllers/webhook.ctrl.js';
import Authorize from '../utils/authorize.utils.js';

const router = express.Router();

router.post('/webhook/v1', Authorize.check, WebhookCtrl.processWebhook);
router.get('/webhook/v1', Authorize.validate, WebhookCtrl.validateWebhook);

router.post('/webhook/discord/v1', Authorize.check, WebhookCtrl.processWebhook);

export default router;
