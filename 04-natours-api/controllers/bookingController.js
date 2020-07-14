const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/* GET BOOKING CHECKOUT HANDLER */
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently booked Tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'kes',
        quantity: 1,
      },
    ],
  });

  // 3. Create Session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

/* CREATE BOOKING  CHECKOUT HANDLER */
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is temporary because it is unsecure
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

/* CREATE BOOKING HANDLER */
exports.createBooking = factory.createOne(Booking);

/* GET ALL BOOKINGS HANDLER */
exports.getAllBookings = factory.getAll(Booking);

/* GET BOOKING HANDLER */
exports.getBooking = factory.getone(Booking);

/* EDIT BOOKING HANDLER */
exports.updateBooking = factory.updateOne(Booking);

/* DELETE BOOKING HANDLER */
exports.deleteBooking = factory.deleteOne(Booking);
