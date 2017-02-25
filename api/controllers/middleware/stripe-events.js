var stripeWebhookFactory = require('stripe-webhook-middleware'),
		path = require('path'),
		config = require('../../config'),
		express = require('express'),
		router = module.exports = express.Router(),
		fs = require('fs');
var bodyParser = require('body-parser'),
	Payments = require('../parse/payments');

var stripeWebhook = new stripeWebhookFactory({
	stripeApiKey: config.stripe.testSecret,
	respond: true
});

var stripeWebhookTest = new stripeWebhookFactory({
	stripeApiKey: config.stripe.testSecret,
	respond: true
});
 
router.route('/*')
.all(bodyParser.urlencoded({extended: false}),
	stripeWebhookTest.middleware, logStripe);

function logStripe(req, res, next) {
	var payment = req.body,
			data = JSON.stringify(payment) + '\nstripeEvent: '+ JSON.stringify(req.stripeEvent);
	return next(new Error(data), null);
	return res.send('\nDATA: ' + data);

	fs.appendFile('/var/log/beacons-stripe_' + Date().getFullYear() + '-' + Date().getMonth() + '.log',
		[new Date(), data, '\n===================\n\n\n'].join('\t'), 'utf8', function _onWrite(err) {
		if ( err ) { return res.status(500).send(err); }
		res.status(200).end();
		// res.send('logged')
	});
}

var knownEvents = {
	'charge.succeeded': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		Payments.create({id: req.body.id, email: req.body.email, data: req.body}, function _evtLogged(err, result) {
			console.warn('GREAT SUCCESS, OUR EVENT LOGGED:', arguments);
		});
		res.status(200).end();
	},
	'invoice.payment_succeeded': function(req, res, next) {
		// console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		// console.log('LINES: ', req.stripeEvent.data.object.lines);
		if ( config.debug || req.body.livemode ) {
				extendApp = new ExtendApp(req.body, function(err, success) {
				if ( err ) { return res.status(501).send(err); }
				res.status(200).end();
			});
		} else {
			console.log('START: WARNING TEST MODE STRIPE EVENT!!!');
			console.log('	PAYMENT SUCCEEDED');
			console.log('	DATA:', req.body);
			console.log('FINAL: WARNING TEST MODE STRIPE EVENT!!!');
			res.status(200).end();
		}
	},
	'invoice.payment_failed': function(req, res, next) {
		// console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		if ( config.debug || req.body.livemode ) {
			extendApp = new ExtendApp(req.body, function(err, success) {
				if ( err ) { return res.status(501).send(err); }
				res.status(200).end();
			});
		} else {
			console.log('START: WARNING TEST MODE STRIPE EVENT!!!');
			console.log('	PAYMENT FAILED');
			console.log('	DATA:', req.body);
			console.log('FINAL: WARNING TEST MODE STRIPE EVENT!!!');
			res.status(200).end();
		}
	},
	'customer.subscription.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		//TODO: run extend-product.cancel
		//TODO: NOTIFY ADMIN
		if ( config.debug || req.body.livemode ) {
			throw new Error('MUST HANDLE RENEWAL FAILURES!!!')
			// extendApp = new ExtendApp(req.body, function(err, success) {
			// 	if ( err ) { return res.status(501).send(err); }
			// 	res.status(200).end();
			// });
		} else {
			console.log('START: WARNING TEST MODE STRIPE EVENT!!!');
			console.log('	PAYMENT SUCCEEDED');
			console.log('	DATA:', req.body);
			console.log('FINAL: WARNING TEST MODE STRIPE EVENT!!!');
			res.status(200).end();
		}
	},
	'account.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'account.application.deauthorized': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'application_fee.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'application_fee.refunded': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'balance.available': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	// 'charge.succeeded': function(req, res, next) {
	// 	console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);

	// 	res.status(200).end();
	// },
	'charge.failed': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.refunded': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.captured': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.dispute.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.dispute.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'charge.dispute.closed': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.card.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.card.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.card.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.subscription.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
		//TODO: NOTIFY ADMIN
	},
	'customer.subscription.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.subscription.trial_will_end': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.discount.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.discount.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'customer.discount.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'invoice.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		// logStripe(req, res, 'invoice_created')
		res.status(200).end();
	},
	'invoice.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		// logStripe(req, res, 'invoice_updated')
		res.status(200).end();
	},
	'invoiceitem.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'invoiceitem.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'invoiceitem.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'plan.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'plan.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'plan.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'coupon.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'coupon.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'recipient.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'recipient.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'recipient.deleted': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'transfer.created': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'transfer.updated': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'transfer.paid': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'transfer.failed': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	},
	'ping': function(req, res, next) {
		console.log(req.stripeEvent.type + ': event processed', req.stripeEvent);
		res.status(200).end();
	}
};

// router.route('/test/*')
// 	.put(bodyParser.json(), bodyParser.urlencoded({extended: false}),
// 				stripeWebhookTest.middleware, stripeEvents)
// 	.post(bodyParser.json(), bodyParser.urlencoded({extended: false}),
// 				stripeWebhookTest.middleware, stripeEvents);

// router.route('/*')
// 	.post(bodyParser.json(), bodyParser.urlencoded({extended: false}),
// 				stripeWebhook.middleware, stripeEvents)
// 	.put( bodyParser.json(), bodyParser.urlencoded({extended: false}),
// 				stripeWebhook.middleware, stripeEvents);




function stripeEvents(req, res, next) {
	console.error('UNKNOWN STRIPE EVENT: ' + (req.stripeEvent && req.stripeEvent.type | 'NO `req.stripeEvent.type`'));
	if(req.stripeEvent && req.stripeEvent.type && knownEvents[req.stripeEvent.type]) {
		logStripe(req, res, req.stripeEvent.type);
		knownEvents[req.stripeEvent.type](req, res, next);
	} else {
		return next(new Error('Stripe Event not found ' + (req.stripeEvent && req.stripeEvent.type || '')));
	}
}


/*
HANDLE EXTENDING USERS HERE!
{
	"object": {
		"date": 1419800922,
		"id": "in_15EoHGHZ4zW63OoaKoAidCge",
		"period_start": 1419796656,
		"period_end": 1419800922,
		"lines": {
			"object": "list",
			"total_count": 1,
			"has_more": false,
			"url": "/v1/invoices/in_15EoHGHZ4zW63OoaKoAidCge/lines",
			"data": [
				{
					"id": "sub_5PdYpgauTAetPU",
					"object": "line_item",
					"type": "subscription",
					"livemode": false,
					"amount": 1999,
					"currency": "usd",
					"proration": false,
					"period": {
						"start": 1419800922,
						"end": 1422479322
					},
					"subscription": null,
					"quantity": 1,
					"plan": {
						"interval": "month",
						"name": "Virtual Office",
						"created": 1418259155,
						"amount": 1999,
						"currency": "usd",
						"id": "voclassic",
						"object": "plan",
						"livemode": false,
						"interval_count": 1,
						"trial_period_days": null,
						"metadata": {},
						"statement_descriptor": null
					},
					"description": null,
					"metadata": {}
				}
			]
		},
		"subtotal": 1999,
		"total": 1999,
		"customer": "cus_5PcKACZeUlFKlf",
		"object": "invoice",
		"attempted": true,
		"closed": true,
		"forgiven": false,
		"paid": true,
		"livemode": false,
		"attempt_count": 1,
		"amount_due": 1999,
		"currency": "usd",
		"starting_balance": 0,
		"ending_balance": 0,
		"next_payment_attempt": null,
		"webhooks_delivered_at": null,
		"charge": "ch_15EoHGHZ4zW63OoafrpHcyYx",
		"discount": null,
		"application_fee": null,
		"subscription": "sub_5PdYpgauTAetPU",
		"tax_percent": null,
		"metadata": {},
		"statement_descriptor": null,
		"description": null,
		"receipt_number": null
	}
}

 */
