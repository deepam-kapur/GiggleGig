import Crypto from 'crypto';
import Config from '../config';
import ErrorHelper from '../helpers/error.helpers';

import { COMMON_ERROR_MESSAGE, STATUS_CODES, } from '../config/constants/common.constants';

const FB_TOKEN = Config.FB_TOKEN;

const check = (req, res, next) => {
    const signature = req.headers["x-hub-signature-256"];
    if(!signature){
        throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
    }

    const buf = req.body;
    const encryptedToken = Crypto.createHmac("sha256", FB_TOKEN).update(buf).digest("hex");

    if(signature !== encryptedToken){
        throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.BAD_REQUEST);
    }

    next();
};

const validate = (req, res, next) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];

    if (mode !== "subscribe" || token !== FB_TOKEN) {
        throw ErrorHelper.create(COMMON_ERROR_MESSAGE.signature_not_valid, STATUS_CODES.ERROR.FORBIDDEN);
    }

    next();
};

export default {
    check,
    validate,
};