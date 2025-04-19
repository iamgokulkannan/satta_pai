import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth from firebase/auth
import { useParams, useNavigate } from 'react-router-dom';
import './comments.css';
import NavBar from './navBar';
import Footer from './footer';

const CommentsPage = ({ username, setUsername }) => {
    const { productId } = useParams();  // Get productId from URL
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const auth = getAuth(); // Initialize auth
    const user = auth.currentUser; // Get current user

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
    }, []);

    const fetchAllComments = useCallback(async () => {
        setLoading(true); // Set loading to true before fetching comments
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments.filter(comment => comment.productId === productId));
        setLoading(false); // Set loading to false after fetching comments
    }, [productId]);

    useEffect(() => {
        fetchAllComments();
    }, [fetchAllComments]);

    const handleEditComment = async (commentId, editedText, editedRating, editedPhotos) => {
        const updateData = { text: editedText, rating: editedRating, photos: editedPhotos };

        await updateDoc(doc(db, 'comments', commentId), updateData);
        setEditingComment(null);
        fetchAllComments();
    };

    const handleDeleteComment = async (commentId) => {
        await deleteDoc(doc(db, 'comments', commentId));
        fetchAllComments();
    };

    const EditComment = ({ comment, handleEditComment, cancelEdit }) => {
        const [editedText, setEditedText] = useState(comment.text);
        const [editedRating, setEditedRating] = useState(comment.rating);
        const [editedPhotos, setEditedPhotos] = useState(comment.photos || []);

        const handlePhotoChange = (e) => {
            const files = Array.from(e.target.files);
            const newPhotos = [];

            files.forEach(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    newPhotos.push(reader.result);
                    if (newPhotos.length === files.length) {
                        setEditedPhotos([...editedPhotos, ...newPhotos]);
                    }
                };
            });
        };

        const handleRemovePhoto = (index) => {
            setEditedPhotos(editedPhotos.filter((_, i) => i !== index));
        };

        return (
            <div className="edit-comment">
                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />

                {/* Star Rating with Animated Color Effect */}
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={editedRating >= star ? 'star selected' : 'star'}
                            onClick={() => setEditedRating(star)}
                            style={{ color: editedRating >= star ? '#FFD700' : '#ccc', transition: 'color 0.3s ease', cursor: 'pointer' }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Photo Upload UI */}
                <div className="edit-photo-section">
                    {editedPhotos.length > 0 && (
                        <div className="photo-preview">
                            {editedPhotos.map((photo, index) => (
                                <div key={index} className="photo-item">
                                    <img src={photo} alt="Comment" className="comment-photo" />
                                    <button onClick={() => handleRemovePhoto(index)} className="remove-photo-btn">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <input type="file" accept="image/*" multiple onChange={handlePhotoChange} style={{ display: 'none' }} id="edit-photo" />
                    
                    <button onClick={() => document.getElementById('edit-photo').click()} className="photo-btn">
                        Add Photos
                    </button>

                    <input type="file" accept="image/*" capture="camera" onChange={handlePhotoChange} style={{ display: 'none' }} id="take-photo" />
                    
                    <button onClick={() => document.getElementById('take-photo').click()} className="photo-btn">
                        Take Photo
                    </button>
                </div>

                <button onClick={() => handleEditComment(comment.id, editedText, editedRating, editedPhotos)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
            </div>
        );
    };

    return (
        <>
            <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
            <div className="comments-section">
                <h2>All Reviews</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>

                <div className="comments-list">
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : comments.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                {editingComment === comment.id ? (
                                    <EditComment
                                        comment={comment}
                                        handleEditComment={handleEditComment}
                                        cancelEdit={() => setEditingComment(null)}
                                    />
                                ) : (
                                    <>
                                        <p><strong>{comment.username}</strong>: {comment.text}</p>
                                        <p>Rating: {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}</p>

                                        {comment.photos && comment.photos.length > 0 && (
                                            <div className="photo-preview">
                                                {comment.photos.map((photo, index) => (
                                                    <div key={index} className="photo-item">
                                                        <img src={photo} alt="Comment" className="comment-photo" onClick={() => setSelectedPhoto(photo)} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {comment.email === user?.email && (
                                            <>
                                                <button onClick={() => setEditingComment(comment.id)}>Edit</button>
                                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />

            {/* Photo Viewing Modal */}
            {selectedPhoto && (
                <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
                    <img src={selectedPhoto} alt="Selected" className="modal-photo" />
                </div>
            )}
        </>
    );
};

export default CommentsPage;