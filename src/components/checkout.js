import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useLocation for state
import NavBar from './navBar';
import Footer from './footer';
import { assets } from '../assets/images/assets';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firestore imports
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // For authenticated user's ID
import './checkout.css';

const Checkout = ({ username, setUsername }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object to get state
  const db = getFirestore();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cod',
  });

  // Get totalCost and items from location state
  const totalCost = location.state?.totalCost || 0; // Fallback to 0 if no state is passed
  const items = location.state?.items || []; // Fallback to an empty array if no items are passed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        alert('You need to be logged in to place an order.');
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveOrderToFirestore = async (paymentDetails) => {
    try {
      const orderData = {
        userId: user.uid,
        date: new Date(),
        total: totalCost,
        items: items,
        address: formData.address,
        paymentDetails: paymentDetails || null,
        paymentMethod: formData.paymentMethod,
      };

      await addDoc(collection(db, 'orders'), orderData);
      alert('Order placed successfully!');
      localStorage.removeItem('cart'); // Clear the cart after order is placed
      navigate('/orderSuccessful');
    } catch (error) {
      console.error('Error saving order:', error.message);
      alert('Failed to place order. Please try again.');
    }
  };

  const handlePaymentError = (error) => {
    let errorMessage = 'Payment failed. Please try again.';
    
    if (error.error) {
      switch (error.error.code) {
        case 'card_declined':
          errorMessage = 'Your card was declined. Please check your card details or try a different card.';
          break;
        case 'insufficient_funds':
          errorMessage = 'Insufficient funds in your account. Please try a different payment method.';
          break;
        case 'expired_card':
          errorMessage = 'Your card has expired. Please use a valid card.';
          break;
        case 'invalid_card':
          errorMessage = 'Invalid card details. Please check and try again.';
          break;
        case 'processing_error':
          errorMessage = 'There was an error processing your payment. Please try again.';
          break;
        default:
          errorMessage = `Payment failed: ${error.error.description}`;
      }
    }
    
    setPaymentError(errorMessage);
    console.error('Payment Error:', error);
    
    // Log error to your error tracking system
    if (window.analytics) {
      window.analytics.track('Payment Failed', {
        errorCode: error.error?.code,
        errorDescription: error.error?.description,
        amount: totalCost,
        retryCount
      });
    }
  };

  const retryPayment = () => {
    if (retryCount < MAX_RETRIES) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      setPaymentError(null);
      
      // Reinitialize payment after a short delay
      setTimeout(() => {
        initializePayment();
        setIsRetrying(false);
      }, 2000);
    } else {
      setPaymentError('Maximum retry attempts reached. Please try again later or contact support.');
    }
  };

  const initializePayment = () => {
    if (!window.Razorpay) {
      setPaymentError("Payment system is not available. Please check your connection.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_NaBWqfY1b83Kid',
      amount: Math.round(parseFloat(totalCost) * 100),
      currency: 'INR',
      name: 'Satta Pai',
      description: 'Payment Transaction',
      image: assets.logo,
      handler: function (response) {
        setPaymentError(null);
        saveOrderToFirestore(response);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function () {
          setPaymentError("Payment cancelled by user.");
        },
      }
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on('payment.failed', function (response) {
      handlePaymentError(response);
    });

    try {
      rzp1.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      setPaymentError("Failed to initiate payment. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    if (formData.paymentMethod === 'cod') {
      saveOrderToFirestore();
    } else {
      initializePayment();
    }
  };

  return (
    <div>
      <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
      <div className="checkout-container">
        <h2>Checkout</h2>
        {paymentError && (
          <div className="payment-error">
            <p>{paymentError}</p>
            {retryCount < MAX_RETRIES && (
              <button 
                onClick={retryPayment} 
                disabled={isRetrying}
                className="retry-button"
              >
                {isRetrying ? 'Retrying...' : 'Retry Payment'}
              </button>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="number" name="phone" value={formData.phone} onChange={handleChange} required  />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
          <div className="checkout-button-wrapper">
            {formData.paymentMethod !== 'cod' && (
              <button type="submit" className="checkout-button">Proceed to Payment</button>
            )}
            {formData.paymentMethod === 'cod' && (
              <button type="submit" className="checkout-button">Place Order</button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;