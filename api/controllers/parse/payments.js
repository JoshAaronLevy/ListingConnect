var Parse = require('./');
module.exports = new StripeEventsService();

function StripeEventsService() {
  return {
    create: function _create(opts,/*{id, email, data}*/ callback) {
      var StripeEvents = Parse.Object.extend("EventLogs");
      var stripeEvents = new StripeEvents();

      stripeEvents.set("id", opts.id);
      stripeEvents.set("eventType", "stripe");
      stripeEvents.set("email", opts.email || email);
      stripeEvents.set("data", opts.data);

      stripeEvents.save(null, {
        success: function(stripeEvents) {
          return callback(null, stripeEvents);
        },
        error: function(stripeEvents, error) {
          console.warn('StripeError: ', error, '\n\nStripeEvents:', stripeEvents);
          return callback(error, stripeEvents);
        }
      });
    }
  };
}
