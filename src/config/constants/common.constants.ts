export const SLACK_COMMAND = {
  GG: '/gg',
};

export const SLACK_COMMAND_TEXT = {
  START: 'start',
  INFO: 'info',
};

export const SLACK_REQUEST_TYPE = {
  URL_VERIFICATION: 'url_verification',
  EVENT_CALLBACK: 'event_callback',
};

export const SLACK_INTERACTIVE_TYPE = {
  BLOCK_ACTIONS: 'block_actions',
};

export const SLACK_INTERACTIVE_ACTIONS = {
  YES: 'count_me_in',
  NO: 'not_interested',
};

export const EVENT_TYPE = {
  MESSAGE: 'message',
  APP_MENTION: 'app_mention',
};

export const EVENT_SUBTYPE = {
  MESSAGE: 'message',
  MESSAGE_CHANGED: 'message_changed',
};

export enum STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export enum SESSION_STATUS {
  IN_PROGRESS = 'in_progress',
  HALF_TIME = 'half_time',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TERMINATED = 'terminated',
}
