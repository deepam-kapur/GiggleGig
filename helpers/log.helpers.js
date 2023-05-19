class LogHelpers {
  constructor(value = 'Mixor') {
    this.logFile = value;
  }

  record(...value) {
    // eslint-disable-next-line no-console
    console.log(`Log - ${this.logFile} : `, ...value);
  }

  error(...value) {
    // eslint-disable-next-line no-console
    console.error(`Log - ${this.logFile} : `, ...value);
  }

  trace(...value) {
    // eslint-disable-next-line no-console
    console.trace(`Log - ${this.logFile} : `, ...value);
  }

  info(...value) {
    // eslint-disable-next-line no-console
    console.log(`Log - ${this.logFile} : `, ...value);
  }
}

export default LogHelpers;
