
let _prefix = "\x1b[36m>\x1b[0m";

const setPrefix = (prefix) => 
{
    _prefix = `\e[36m${prefix}\x1b[0m`;
}

const red = (str) =>
{
    return `\x1b[31m${str}\x1b[0m`;
}

const green = (str) =>
{
    return `\x1b[32m${str}\x1b[0m`;
}

const yellow = (str) =>
{
    return `\x1b[33m${str}\x1b[0m`;
}

const magenta = (str) =>
{
    return `\x1b[35m${str}\x1b[0m`;
}

const teal = (str) => {
    return `\e[1;36m${str}\x1b[0m`;
}

const logInfo = (str) =>
{
    console.info(`${_prefix} ${green(str)}`);
}

const logErr = (str) =>
{
    console.error(red(`ERROR: ${str}`));
}

const logWarn = (str) =>
{
    console.warn(yellow(`WARNING: ${str}`));
}

module.exports = {
    red:     red,
    green:   green,
    yellow:  yellow,
    magenta: magenta,
    teal:    teal,
    logInfo: logInfo,
    logErr:  logErr,
    logWarn: logWarn,
    setPrefix: setPrefix
};
