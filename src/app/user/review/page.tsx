"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import './Review.css';

interface Review {
  _id: string;
  customerName: string;
  reviewText: string;
  rating: number;
  restaurantId: string;
}

const Home = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  //  restaurant ID from system
  const restaurantId = 'restaurant123'; 
  const customerId = 'customer1'; //come from authentication

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002';
      const result = await axios.get(`${apiBaseUrl}/api/reviews`, {
        params: { restaurantId }
      });
      setReviews(result.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSave = () => {
    fetchReviews();
  };
  
  const handleDelete = async (reviewId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002';
      await axios.delete(`${apiBaseUrl}/api/reviews/${reviewId}`, {
        data: { customerId }
      });
      
      setReviews(reviews.filter(review => review._id !== reviewId));
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  };

  const handleEdit = async (reviewId: string, updatedReview: Partial<Review>): Promise<boolean> => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002';
      const response = await axios.put(`${apiBaseUrl}/api/reviews/${reviewId}`, {
        ...updatedReview,
        customerId,
        restaurantId
      });
      
      if (response.status === 200) {
        // Update the review in the local state
        setReviews(reviews.map(review => 
          review._id === reviewId ? { ...review, ...response.data } : review
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Add Your Foodie Review</h1>
        <p className="home-subtitle">Share your experiences</p>
      </div>
      
      {error && (
        <div className="error-message" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#ffdddd', color: '#ff0000', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <ReviewForm onSave={handleSave} restaurantId={restaurantId} />
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading reviews...</div>
      ) : (
        <ReviewList reviews={reviews} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Home;