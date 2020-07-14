/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51H4WOVH4TGquSrf3mlEEn6aGgsUrX6qynvEJP9aCfoknVd9Ivvm0l5Nn0Ss7SNob7HWFBNV3oNpBIK2fxJfsxYNX00hyc9kHfT'
);

export const bookTour = async (tourId) => {
  try {
    //1) Get Checkput Session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //2) Create checkput for + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
