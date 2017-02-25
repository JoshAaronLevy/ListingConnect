var fs = require('fs');
var sessionFile = '/tmp/beacon-parse-session-token.key';

exports.saveToken = function _toke(token) {
  fs.writeFileSync(sessionFile, token);
  return token;
};
exports.getToken = function _toke() {
  try {
    return fs.readFileSync(sessionFile, 'utf8');
  } catch(ex) {
    // console.error('No token file at ' + sessionFile);
    return '';
  }
};

exports.save = function(name, data) {
  // res.headers['set-cookie'].pop().split(';')[0]

};

exports.getPointer = function getPointer(objectId, className) {
  className = className || '_User';
  return { "__type": "Pointer",
    "className": className,
    "objectId": objectId };
};
