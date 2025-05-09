"use client";
import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';

interface ReviewFormProps {
  onSave: () => void;
  restaurantId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSave, restaurantId }) => {
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({
    customerName: '',
    reviewText: '',
    rating: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      customerName: '',
      reviewText: '',
      rating: ''
    };

    if (!customerName.trim()) {
      newErrors.customerName = 'Name is required';
      valid = false;
    } else if (customerName.length > 50) {
      newErrors.customerName = 'Name must be 50 characters or less';
      valid = false;
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = 'Review text is required';
      valid = false;
    } else if (reviewText.length > 500) {
      newErrors.reviewText = 'Review must be 500 characters or less';
      valid = false;
    }

    if (rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const customerId = 'customer1'; //  come from authentication
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002';

      await axios.post(`${apiBaseUrl}/api/reviews`, {
        customerId,
        customerName,
        restaurantId,
        reviewText,
        rating,
      });

      // Reset form
      setCustomerName('');
      setReviewText('');
      setRating(1);
      setErrors({
        customerName: '',
        reviewText: '',
        rating: ''
      });

      // thank you message
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);

      //refresh reviews
      onSave();
    } catch (error) {
      console.error('Error submitting review:', error);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    setErrors(prev => ({ ...prev, rating: '' }));
  };

  const handleStarHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const handleStarHoverLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="review-form-container">
      {showThankYou && (
        <div className="thank-you-overlay">
          <div className="thank-you-message">
            <span className="close-alert" onClick={() => setShowThankYou(false)}>
              &times;
            </span>
            Thank you for your review!
          </div>
        </div>
      )}
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit} className="review-form" noValidate>
        <div className="form-group">
          <label htmlFor="customerName">Your Name</label>
          <input
            id="customerName"
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setErrors(prev => ({ ...prev, customerName: '' }));
            }}
            required
          />
          {errors.customerName && <span className="error-message">{errors.customerName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reviewText">Your Review</label>
          <textarea
            id="reviewText"
            placeholder="Tell us about your experience"
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              setErrors(prev => ({ ...prev, reviewText: '' }));
            }}
            rows={4}
            required
          />
          {errors.reviewText && <span className="error-message">{errors.reviewText}</span>}
        </div>

        <div className="form-group">
          <label>Your Rating</label>
          <div
            className="star-rating"
            onMouseLeave={handleStarHoverLeave}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${(hoverRating || rating) >= star ? 'filled' : 'empty'}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
              >
                ★
              </span>
            ))}
          </div>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;