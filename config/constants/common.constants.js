const COMMON_ERROR_MESSAGE = {
    signature_not_valid: 'Signature provided is not valid',
    url_not_found: 'URL not found',
    invalid: 'Something broke!',
};

const STATUS_CODES = {
    ERROR: {
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        DEFAULT: 500,
        FORBIDDEN: 403,
    },
    SUCCESS: 200
};

export {
    COMMON_ERROR_MESSAGE,
    STATUS_CODES,
};