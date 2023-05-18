import express from 'express';
import WebhookCtrl from '../controllers/webhook.ctrl';
import Authorize from '../utils/authorize.utils';

const router = express.Router();

router.post('/api/webhook/v1', Authorize.check, WebhookCtrl.processWebhook);
router.get('/api/webhook/v1', Authorize.validate, WebhookCtrl.validateWebhook);

export default router;