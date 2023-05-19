class LogHelpers {
  constructor(value = 'Mixor') {
    this.logFile = value;
  }

  record(...value) {
    console.log(`Log - ${this.logFile} : `, ...value);
  }

  error(...value) {
    console.error(`Log - ${this.logFile} : `, ...value);
  }

  trace(...value) {
    console.trace(`Log - ${this.logFile} : `, ...value);
  }

  info(...value) {
    console.log(`Log - ${this.logFile} : `, ...value);
  }
}

export default LogHelpers;
