const setting = require('./settings');

module.exports = {
    files: [`${setting.basedir}/**`],
    "server": setting.basedir
};