var express = require('express');
var app = module.exports = express();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var middleware = require('./api/controllers/middleware');
var errors = require('./api/controllers/errors');
var config = require('./api/config');

app.set('title', config.title);
app.set('port', config.port);

app.use(cookieParser());
app.use(session(config.session));
app.use(morgan(config.morgan));

// app.use(middleware.allowAllCors);

app.use(express.static('_output'));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json(), bodyParser.urlencoded({extended: false}));

app.use('/stripe', require('./api/controllers/middleware/stripe-events'));

app.use('/api/auth', require('./api/controllers/auth'));
app.use('/api/parse', require('./api/controllers/proxy/routes'));
app.use('/api/proxy', require('./api/controllers/proxy'));


app.use(errors.unhandledException);
app.use(errors.notFound);

app.listen(app.get('port'), function () {
  console.log('%s is listening on port %d in %s mode',
    app.get('title'),
    app.get('port'),
    app.get('env'));
});