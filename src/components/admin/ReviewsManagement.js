import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ReviewsManagement.css';

const ReviewsManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            console.log('Fetching reviews...');
            const commentsCollection = collection(db, 'comments');
            const snapshot = await getDocs(commentsCollection);
            console.log('Comments snapshot received:', snapshot.docs.length, 'comments');
            
            const reviewsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('Processed reviews:', reviewsList);
            setReviews(reviewsList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError(`Failed to fetch reviews: ${error.message}`);
            setLoading(false);
        }
    };

    const handleDelete = async (review) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteDoc(doc(db, 'comments', review.id));
                fetchReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
                setError(`Failed to delete review: ${error.message}`);
            }
        }
    };

    const handleApprove = async (review) => {
        try {
            await updateDoc(doc(db, 'comments', review.id), {
                approved: true
            });
            fetchReviews();
        } catch (error) {
            console.error('Error approving review:', error);
            setError(`Failed to approve review: ${error.message}`);
        }
    };

    const handleViewDetails = (review) => {
        setSelectedReview(review);
    };

    const closeModal = () => {
        setSelectedReview(null);
    };

    if (loading) {
        return <div className="loading">Loading reviews...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (reviews.length === 0) {
        return <div className="no-reviews">No reviews found in the database.</div>;
    }

    return (
        <div className="reviews-management">
            <h2>Reviews Management</h2>
            
            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <h3>{review.userName || 'Anonymous User'}</h3>
                            <div className="review-rating">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                        </div>
                        <p className="review-text">{review.text || review.comment}</p>
                        <div className="review-meta">
                            <span>Product: {review.productName || 'Unknown Product'}</span>
                            <span>Date: {review.timestamp ? new Date(review.timestamp.toDate()).toLocaleDateString() : 'No date'}</span>
                            <span>Status: {review.approved ? 'Approved' : 'Pending'}</span>
                        </div>
                        <div className="review-actions">
                            <button onClick={() => handleViewDetails(review)}>View Details</button>
                            {!review.approved && (
                                <button onClick={() => handleApprove(review)}>Approve</button>
                            )}
                            <button onClick={() => handleDelete(review)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedReview && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Review Details</h2>
                        <div className="review-details">
                            <p><strong>User:</strong> {selectedReview.userName || 'Anonymous User'}</p>
                            <p><strong>Product:</strong> {selectedReview.productName || 'Unknown Product'}</p>
                            <p><strong>Rating:</strong> {'★'.repeat(selectedReview.rating)}{'☆'.repeat(5 - selectedReview.rating)}</p>
                            <p><strong>Date:</strong> {selectedReview.timestamp ? new Date(selectedReview.timestamp.toDate()).toLocaleDateString() : 'No date'}</p>
                            <p><strong>Status:</strong> {selectedReview.approved ? 'Approved' : 'Pending'}</p>
                            <p><strong>Comment:</strong></p>
                            <p>{selectedReview.text || selectedReview.comment}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsManagement; 