class Log {
    #logFile;
    constructor(value = 'Mixor'){
        this.#logFile = value;
    }

    record(...value){
        console.table(`Log File - ${this.#logFile}`, ...value);
    }

    error(...value){
        console.error(`Log File - ${this.#logFile}`, ...value);
    }

    trace(...value){
        console.trace(`Log File - ${this.#logFile}`, ...value);
    }
}

export default Log;