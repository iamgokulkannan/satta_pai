import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { products } from '../assets/images/assets';

const Comments = ({ username, setUsername, productId }) => {
    const product = products.find((p) => p._id === productId); // Find product by ID

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedText, setEditedText] = useState('');

    const fetchComments = useCallback(async () => {
        const querySnapshot = await getDocs(collection(db, 'comments'));
        const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments.filter(comment => comment.productId === productId));
    }, [productId]); // Memoize function using useCallback

    useEffect(() => {
        if (product) {
            document.title = product.name + " | Satta Pai";
        }
        fetchComments();
    }, [product, fetchComments]); // Include fetchComments in dependencies

    const handleAddComment = async () => {
        if (!username) {
            alert("You need to log in to post a comment.");
            return;
        }

        if (!newComment.trim()) return;

        const commentData = {
            productId,
            username,
            text: newComment,
            timestamp: new Date()
        };

        await addDoc(collection(db, 'comments'), commentData);
        setNewComment('');
        fetchComments();
    };

    const handleDeleteComment = async (commentId) => {
        await deleteDoc(doc(db, 'comments', commentId));
        fetchComments();
    };

    const handleEditComment = async (commentId) => {
        await updateDoc(doc(db, 'comments', commentId), { text: editedText });
        setEditingComment(null);
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
            <button onClick={handleAddComment}>Post Comment</button>

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        {editingComment === comment.id ? (
                            <>
                                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)}></textarea>
                                <button onClick={() => handleEditComment(comment.id)}>Save</button>
                                <button onClick={() => setEditingComment(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p><strong>{comment.username}</strong>: {comment.text}</p>
                                {comment.username === username && (
                                    <>
                                        <button onClick={() => setEditingComment(comment.id) || setEditedText(comment.text)}>Edit</button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;