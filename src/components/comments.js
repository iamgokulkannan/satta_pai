import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { products } from '../assets/images/assets';
import './comments.css';

const Comments = ({ username, productId }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const product = products.find((p) => p._id === productId);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [photo, setPhoto] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [editedPhoto, setEditedPhoto] = useState('');

    // Fetch comments (limit to latest 5)
    const fetchComments = useCallback(async () => {
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments.filter(comment => comment.productId === productId));
    }, [productId]);

    useEffect(() => {
        if (product) {
            document.title = product.name + " | Satta Pai";
        }
        fetchComments();
    }, [product, fetchComments]);

    // Convert image to Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPhoto(reader.result); // Store Base64 string
            };
        }
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
            setPhoto(photoData);

            // Stop the camera stream after capturing
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            setShowCamera(false);
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            alert("You need to log in to post a comment.");
            return;
        }

        if (!newComment.trim()) return;

        const commentData = {
            productId,
            username: user.displayName || "Anonymous",
            email: user.email,
            text: newComment,
            rating: starRating,
            photo: photo,  // Store Base64 image
            timestamp: new Date()
        };

        // Add the comment
        await addDoc(collection(db, 'comments'), commentData);
        setNewComment('');
        setStarRating(0);
        setPhoto('');
        fetchComments();

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Check if there are more than 5 comments and delete the oldest
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 5) {
            await deleteDoc(doc(db, 'comments', querySnapshot.docs[0].id));
        }
    };

    // Delete a Comment
    const handleDeleteComment = async (commentId) => {
        await deleteDoc(doc(db, 'comments', commentId));
        fetchComments();
    };

    // Edit Comment
    const handleEditComment = async (commentId) => {
        const updateData = { text: editedText };
        if (editedPhoto !== '') {
            updateData.photo = editedPhoto;
        }

        await updateDoc(doc(db, 'comments', commentId), updateData);
        setEditingComment(null);
        setEditedPhoto('');
        fetchComments();
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
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={starRating >= star ? 'star selected' : 'star'}
                        onClick={() => setStarRating(star)}
                    >★</span>
                ))}
            </div>

            {/* Photo Upload */}
            <label>Upload Photo:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />

            {/* Capture Photo Button */}
            <button onClick={openCamera}>Take a Photo</button>

            {/* Display Captured Photo */}
            {photo && <img src={photo} alt="Captured" className="comment-photo" />}

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

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        {editingComment === comment.id ? (
                            <>
                                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)}></textarea>

                                {/* Photo Editing Section - IMPROVED and CLARIFIED */}
                                <div className="edit-photo-section">
                                    <label>Edit Photo:</label>

                                    {/* Display Existing Photo if available */}
                                    {comment.photo && !editedPhoto && (
                                        <div className="existing-photo">
                                            <img src={comment.photo} alt="Existing Comment Photo" className="comment-photo" />
                                            <button onClick={() => setEditedPhoto('')}>Remove Photo</button> {/* Keep remove button - Label is clear now */}
                                        </div>
                                    )}

                                    {/* Display New Photo to be updated */}
                                    {editedPhoto && <img src={editedPhoto} alt="New Comment Photo" className="comment-photo" />}


                                    {/* Option to Change/Replace Photo - Clear Label */}
                                    <button onClick={() => editFileInputRef.current.click()}>Change Photo</button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.readAsDataURL(file);
                                                reader.onload = () => {
                                                    setEditedPhoto(reader.result);
                                                };
                                            }
                                        }}
                                        ref={editFileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    {/* Option to Add Photo if no existing photo AND no new photo selected yet - Clear Label */}
                                    {!comment.photo && !editedPhoto && (
                                        <button onClick={() => editFileInputRef.current.click()}>Add Photo</button>
                                    )}

                                    {/* Option to Keep Existing Photo - Explicit Button if user has selected a *new* photo */}
                                    {comment.photo && editedPhoto && (
                                        <button onClick={() => setEditedPhoto('')}>Keep Existing Photo</button>
                                    )}
                                </div>


                                <button onClick={() => handleEditComment(comment.id)}>Save</button>
                                <button onClick={() => setEditingComment(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p><strong>{comment.username}</strong>: {comment.text}</p>
                                <p>Rating: {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}</p>

                                {/* Display Photo */}
                                {comment.photo && <img src={comment.photo} alt="CommentPhoto" className="comment-photo" />}

                                {comment.username === username && (
                                    <>
                                        <button onClick={() => {
                                            setEditingComment(comment.id);
                                            setEditedText(comment.text);
                                            setEditedPhoto(comment.photo || '');
                                        }}>Edit</button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* View More Comments */}
            <button onClick={() => navigate(`/comments/${productId}`)}>View More</button>
        </div>
    );
};

export default Comments;