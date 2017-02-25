var API_KEY_NAME = "rebeacons";
var API_KEY_TOKEN = "BlueGrotto1";
var sendgrid = require("sendgrid");

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("sendEmail", function(request, response) {
  var isEmail = /[\w\d\.-_]+@[\w\d-_]+\.[\w\.]{2,9}/;
  console.log('SEND_EMAIL.start');
  sendgrid.initialize(API_KEY_NAME, API_KEY_TOKEN);

  var body, msg;
  var fromAddr;

  try {
    body      = request.params || JSON.parse(request.body);
    msg       = encodeURIComponent(body.message || body.msg);
    // fromAddr  = (body.from || body.sender);
  } catch(ex) {
    console.log('EMAIL PRE-VALIDATION FAILED: ' + ex.toString());
    response.error("Uh oh, parsing went wrong: " + ex);
    return;
  }

  sendgrid.sendEmail({
    to: "joshaaronlevy@gmail.com",
    from: "noreply@realestatebeacons.com",
    subject: "Request From Beacons Site",
    text: "Message From User: \n\n" + msg
  }, {
    success: function(httpResponse) {
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      response.error("Uh oh, something went wrong: " + JSON.stringify(httpResponse));
    }
  });

});

Parse.Cloud.define("payNow", function(request, response) {
  var body;
  try {
    body      = request.params || JSON.parse(request.body);
    // fromAddr  = (body.from || body.sender);
  } catch(ex) {
    console.log('EMAIL PRE-VALIDATION FAILED: ' + ex.toString());
    response.error("Uh oh, parsing went wrong: " + ex);
    return;
  }

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")("sk_test_Mea51RuLGmtZCP8oBehIVD3u");

  // Get the credit card details submitted by the form
  var stripeToken = body.stripeToken;

  stripe.customers.create({
    source: stripeToken,
    plan: "beacon-30",
    name: body.shippingAttn,
    email: body.email,
    quantity: body.quantity,
    shipping: {
      address_line1: body.shippingAddress1,
      address_line2: body.shippingAddress2,
      address_city: body.shippingCity,
      address_state: body.shippingState,
      address_postal_code: body.shippingZip,
    }
  }, function(err, customer) {
    // ...
  });

  var body, msg;
  var fromAddr;

});
