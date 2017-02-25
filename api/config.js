var config = module.exports = {
  hostname: process.env.NODE_HOSTNAME || 'localhost',
  title: process.env.NODE_TITLE || 'beaconproxy',
  isDev: (process.env.NODE_ENV === 'development'),
  port: parseInt(process.env.NODE_PORT || 3000, 10),
  session: {
    name: 'bp',
    secret: process.env.NODE_SECRET || 'super_secret_key_should_probably_be_changed',
    maxAge: 6500000
  },
  morgan: 'combined',
  parse: {
    appKey: process.env.PARSE_APP_KEY || 'gp5pTelFu2HAZb4JQcrNVhLVAjmTwn7ysUF8ySSe',
    restKey: process.env.PARSE_REST_KEY || 'GM9jnkdWHxGxhhUxSZ6NsiqVwSAI9iybJmgX2DIm',
    jsKey: process.env.PARSE_JS_KEY || 'sHWp3LeeMD4FARjm6eVpAsft8lO7Wxa4lNM8Vaw6',
    masterKey: process.env.PARSE_MASTER_KEY || '4DHToK3rkfQM6CqijZgCu4K4GShIy8LfnxlykWM6',
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    redirectUri: process.env.FACEBOOK_URI || 'http://localhost:3000/auth/facebook',
    secret: process.env.FACEBOOK_APP_SECRET
  },

  stripe: {
    key:    process.env.STRIPE_PUBLIC,
    secret: process.env.STRIPE_SECRET,

    testSecret: 'sk_test_qHyQLMKxCJXQqIbFFPzgRTzy',
    testKey:    'pk_test_EDCvQdvLgFWQOJSfhrVb48H5',
  },
  proxyTimeout: {parse: (process.env.NODE_ENV === 'development' ? 15 : 5) * 1000},
  proxy: {
    timeout: (process.env.NODE_ENV === 'development' ? 15 : 5) * 1000,
    prefix: '/api',

    translate: {
      '/1/': /\/logout|\/login|\/users|\/roles|\/functions|\/apps|\/events|\/sessions|\/me/,
      '/1/classes/': /./
    }
  }
};
// CHECK & REQUIRE CERTAIN VALUES
// if ( !config.stripe.public  && !config.stripe.secret ) {
//   throw new Error('Env Var(s) Required `STRIPE_PUBLIC` and `STRIPE_SECRET`');
// }