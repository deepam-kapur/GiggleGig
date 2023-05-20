import ErrorHelper from './error.helpers.js';

const send = (res, payload, code) => {
  const contentType = 'application/json';
  let returnPayload = payload;
  let finalCode = code;

  if (payload instanceof ErrorHelper) {
    const errorPayload = payload.get();

    finalCode = errorPayload.code;
    delete errorPayload.code;

    returnPayload = errorPayload;
  }

  if (!finalCode) {
    finalCode = 200;
  }

  res.status(finalCode).json(returnPayload);
};

export default {
  send,
};
