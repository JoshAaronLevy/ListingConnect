var parse = require('parse/node').Parse;
var config = require('../../config');
var _ = require('lodash');
var log = require('debug')('lc:controllers:parse:init');

log('Calling parse.initialize!');
parse.initialize(config.parse.appKey, config.parse.jsKey);
parse.User.enableUnsafeCurrentUser();

module.exports = parse;
