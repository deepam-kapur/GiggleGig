const COMMON_ERROR_MESSAGE = {
  signature_not_valid: 'Signature provided is not valid',
  url_not_found: 'URL not found',
  invalid: 'Something broke!',
  object_type_not_supported: 'Object type not supported',
};

const STATUS_CODES = {
  ERROR: {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    DEFAULT: 500,
    FORBIDDEN: 403,
  },
  SUCCESS: 200,
};

const WEBHOOK_OBJECT_TYPE = {
  INSTAGRAM: 'instagram',
};

export {
  COMMON_ERROR_MESSAGE,
  STATUS_CODES,
  WEBHOOK_OBJECT_TYPE,
};
