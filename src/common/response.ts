import type { Response } from 'express';

import config from '../config';

const env = config.ENVIRONMENT;

// Types
type ErrorWithMessage = {
  message: string;
  statusCode?: number;
  [key: string]: any; // To allow additional properties
};

type errorType = {
  error: ErrorWithMessage;
  message?: string;
  payload?: object;
  statusCode?: number;
  extraParamsObj?: object;
};

type successType = {
  payload?: object;
  message?: string;
  statusCode?: number;
  extraParamsObj?: object;
};

type dataType = {
  payload: object;
  statusCode?: number;
};

type messageType = {
  message: string;
  statusCode?: number;
};

type responseMessageType = {
  success: boolean;
  message: string;
  payload: object;
  error?: object;
};

// Methods
const handleResponseMessage = (
  success: boolean,
  message: string,
  payload: object = null,
  extraParamsObj: object = null,
): responseMessageType => {
  const payloadObj = {
    success,
    message,
    payload,
    ...extraParamsObj,
  };

  return payloadObj;
};

const handleError =
  (response: Response) =>
  ({
    error,
    message = 'Oops! Something went wrong!',
    payload = null,
    statusCode = 500,
    extraParamsObj = null,
  }: errorType): Response => {
    const payloadObj = handleResponseMessage(
      false,
      error?.message || message,
      payload,
      extraParamsObj,
    );
    if (env !== 'production') {
      (payloadObj as any).error = error;
    }

    return response.status(error.statusCode || statusCode).json(payloadObj);
  };

const handleSuccess =
  (response: Response) =>
  ({
    payload = null,
    message = 'Success!',
    statusCode = 200,
    extraParamsObj = null,
  }: successType): Response => {
    const payloadObj = handleResponseMessage(
      true,
      message,
      payload,
      extraParamsObj,
    );

    return response.status(statusCode).json(payloadObj);
  };

const handleData =
  (response: Response) =>
  ({ payload, statusCode = 200 }: dataType): Response => {
    return response.status(statusCode).json(payload);
  };

const handleMessage =
  (response: Response) =>
  ({ message, statusCode = 200 }: messageType): Response => {
    return response.status(statusCode).send(message);
  };

export default (response: Response) => ({
  error: handleError(response),
  success: handleSuccess(response),
  data: handleData(response),
  message: handleMessage(response),
});
