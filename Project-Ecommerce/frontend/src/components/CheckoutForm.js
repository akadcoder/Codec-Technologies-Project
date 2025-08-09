import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';

const stripePromise = loadStripe('your_stripe_publishable_key_here');

const CheckoutFormContent = ({ orderData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      // Create payment intent
      const { data } = await api.post('/orders/create-payment-intent', {
        amount: orderData.totalPrice
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Create order
        const orderResponse = await api.post('/orders', {
          ...orderData,
          paymentMethod: 'stripe'
        });

        onSuccess(orderResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {processing ? 'Processing...' : `Pay $${orderData.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutForm = ({ orderData, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent orderData={orderData} onSuccess={onSuccess} />
    </Elements>
  );
};

export default CheckoutForm;
