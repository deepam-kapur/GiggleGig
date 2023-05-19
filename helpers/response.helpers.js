import ErrorHelper from './error.helpers.js';

const send = (res, payload, code) => {
  let contentType = 'application/json';
  let returnPayload = JSON.stringify(payload);
  let finalCode = code;

  if (payload instanceof ErrorHelper) {
    const errorPayload = payload.get();

    finalCode = errorPayload.code;
    delete errorPayload.code;

    returnPayload = JSON.stringify(errorPayload);
  } else if (payload instanceof Error) {
    contentType = 'text/plain';
    returnPayload = payload.toString();
  } else if (payload instanceof String || typeof payload === 'string') {
    contentType = 'text/plain';
    returnPayload = payload;
  }

  if (!finalCode) {
    finalCode = 200;
  }

  res.writeHead(finalCode, { 'Content-Type': contentType });
  res.send(returnPayload);
};

export default {
  send,
};
