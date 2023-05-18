import LogHelpers from '../helpers/log.helpers';
const Log = new LogHelpers('Webhook-Controller');

import ResponseHelpers from '../helpers/response.helpers';

const processWebhook = () => {

};

const validateWebhook = (req, res) => {
    const { headers, body, query, } = req;
    try {
        const challenge = query['hub.challenge'];
        Log.record('Webhook Verified - ', challenge);
        return ResponseHelpers.send(res, challenge);
    } catch(e) {
        Log.error(e, { headers, body, });
        return ResponseHelpers.send(res, e);
    }
};

export default {
    processWebhook,
    validateWebhook,
}