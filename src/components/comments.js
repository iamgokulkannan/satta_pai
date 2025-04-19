import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { products } from '../assets/images/assets';
import './comments.css';

const Comments = ({ productId }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const product = products.find((p) => p._id === productId);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [commentsLimit] = useState(5);
    const [loading, setLoading] = useState(true);

    // Fetch comments (limit to latest commentsLimit)
    const fetchComments = useCallback(async (append = false) => {
        setLoading(true); // Set loading to true before fetching
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'), limit(commentsLimit));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredComments = fetchedComments.filter(comment => comment.productId === productId);

        setComments(prevComments => append ? [...prevComments, ...filteredComments] : filteredComments);
        setLoading(false); // Set loading to false after fetching
    }, [productId, commentsLimit]);

    useEffect(() => {
        if (product) {
            document.title = product.name + " | Satta Pai";
        }
        fetchComments();
    }, [product, fetchComments]);

    // Convert image to Base64
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                newPhotos.push(reader.result);
                if (newPhotos.length === files.length) {
                    const totalSize = [...photos, ...newPhotos].reduce((acc, photo) => {
                        const sizeInBytes = (photo.length * (3/4)) - (photo.endsWith('==') ? 2 : (photo.endsWith('=') ? 1 : 0));
                        return acc + sizeInBytes;
                    }, 0);

                    if (totalSize > 1 * 1024 * 1024) {
                        alert("Total photo size exceeds the limit of 1MB.");
                    } else {
                        setPhotos([...photos, ...newPhotos]);
                    }
                }
            };
        });
    };

    // Open Camera
    const openCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    };

    // Capture Photo from Camera
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const photoData = canvas.toDataURL('image/png');
            setPhotos([...photos, photoData]);

            // Stop the camera stream after capturing
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            setShowCamera(false);
        }
    };

    const handleAddComment = async () => {
        if(!user){
            alert("You need to be logged in to post a comment.");
            return;
        }

        if (!newComment.trim()) {
            alert("Comment box cannot be empty.");
            return;
        }

        // Check if total photo size exceeds 1MB
        const totalSize = photos.reduce((acc, photo) => {
            const sizeInBytes = (photo.length * (3/4)) - (photo.endsWith('==') ? 2 : (photo.endsWith('=') ? 1 : 0));
            return acc + sizeInBytes;
        }, 0);

        if (totalSize > 1 * 1024 * 1024) {
            alert("Total photo size exceeds the limit of 1MB.");
            return;
        }

        const commentData = {
            productId,
            username: user.displayName || "Anonymous",
            email: user.email,
            text: newComment,
            rating: starRating,
            photos: photos,  // Store Base64 images
            timestamp: new Date()
        };

        // Add the comment
        await addDoc(collection(db, 'comments'), commentData);
        setNewComment('');
        setStarRating(0);
        setPhotos([]);
        fetchComments();

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Delete a Comment
    const handleDeleteComment = async (commentId) => {
        await deleteDoc(doc(db, 'comments', commentId));
        fetchComments();
    };

    // Edit Comment
    const handleEditComment = async (commentId, editedText, editedRating, editedPhotos) => {
        const updateData = { text: editedText, rating: editedRating, photos: editedPhotos };

        await updateDoc(doc(db, 'comments', commentId), updateData);
        setEditingComment(null);
        fetchComments();
    };

    const EditComment = ({ comment, handleEditComment, cancelEdit }) => {
        const [editedText, setEditedText] = useState(comment.text);
        const [editedRating, setEditedRating] = useState(comment.rating);
        const [editedPhotos, setEditedPhotos] = useState(comment.photos || []);
        const [showCamera, setShowCamera] = useState(false);
        const videoRef = useRef(null);
        const canvasRef = useRef(null);

        const handlePhotoChange = (e) => {
            const files = Array.from(e.target.files);
            const newPhotos = [];

            files.forEach(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    newPhotos.push(reader.result);
                    if (newPhotos.length === files.length) {
                        const totalSize = [...editedPhotos, ...newPhotos].reduce((acc, photo) => {
                            const sizeInBytes = (photo.length * (3/4)) - (photo.endsWith('==') ? 2 : (photo.endsWith('=') ? 1 : 0));
                            return acc + sizeInBytes;
                        }, 0);

                        if (totalSize > 1 * 1024 * 1024) {
                            alert("Total photo size exceeds the limit of 1MB.");
                        } else {
                            setEditedPhotos([...editedPhotos, ...newPhotos]);
                        }
                    }
                };
            });
        };

        const handleRemovePhoto = (index) => {
            setEditedPhotos(editedPhotos.filter((_, i) => i !== index));
        };

        const openCamera = async () => {
            setShowCamera(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera: ", error);
            }
        };

        const capturePhoto = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && canvas) {
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const photoData = canvas.toDataURL('image/png');
                setEditedPhotos([...editedPhotos, photoData]);

                // Stop the camera stream after capturing
                const stream = video.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                setShowCamera(false);
            }
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
                    <button onClick={openCamera} className="photo-btn">
                        Take a Photo
                    </button>
                </div>

                <button onClick={() => handleEditComment(comment.id, editedText, editedRating, editedPhotos)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>

                {/* Camera Capture Modal */}
                {showCamera && (
                    <div className="camera-modal">
                        <video ref={videoRef} autoPlay></video>
                        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                        <button onClick={capturePhoto}>Capture</button>
                        <button onClick={() => setShowCamera(false)}>Close</button>
                    </div>
                )}
            </div>
        );
    };

    const handleRemovePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    return (
        <div className="comments-section">
            <h3>Customer Reviews</h3>

            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a review..."
            ></textarea>

            {/* Star Rating Input */}
            <div className="rating">
                <label>Rating:</label>
                {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                        key={index}
                        className={starRating >= star ? 'star selected' : 'star'}
                        onClick={() => setStarRating(index + 1)}
                    >★</span>
                ))}
            </div>

            {/* Add Photo and Capture Photo Buttons */}
            <div className="photo-buttons">
                <button onClick={() => fileInputRef.current.click()} className="photo-btn">
                    Add Photos
                </button>
                <button onClick={openCamera} className="photo-btn">
                    Take a Photo
                </button>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }} 
            />

            {/* Display Selected Photos with Remove Button */}
            {photos.length > 0 && (
                <div className="photo-preview">
                    {photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                            <img src={photo} alt="Chosen" className="comment-photo" />
                            <button onClick={() => handleRemovePhoto(index)} className="remove-photo-btn">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button onClick={handleAddComment}>Post Comment</button>

            {/* Camera Capture Modal */}
            {showCamera && (
                <div className="camera-modal">
                    <video ref={videoRef} autoPlay></video>
                    <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                    <button onClick={capturePhoto}>Capture</button>
                    <button onClick={() => setShowCamera(false)}>Close</button>
                </div>
            )}

            {/* Loading Text */}
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => (
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
                                                    <img src={photo} alt="Comment" className="comment-photo" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {comment.email === user?.email && (
                                        <>
                                            <button onClick={() => {
                                                setEditingComment(comment.id);
                                            }}>Edit</button>
                                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* View More Comments */}
            <button onClick={() => navigate(`/comments/${productId}`)}>View More</button>
        </div>
    );
};

export default Comments;