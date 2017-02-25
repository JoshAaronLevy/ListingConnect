var _ = require('lodash');
var isDevMode = process.env.NODE_ENV !== 'production'; // dev by default

var globalOptions = {
  siteName: 'Listing Connect',
  copyright: 'Hillside Software, Inc. All rights reserved.',
  email: 'josh@listingconnect.com'
};

module.exports = _.merge({},
  globalOptions,
  isDevMode ? require('./development') : require('./production'));