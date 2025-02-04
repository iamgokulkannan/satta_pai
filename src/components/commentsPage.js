import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './comments.css';
import NavBar from './navBar';
import Footer from './footer';

const CommentsPage = ({ username, setUsername}) => {
    const { productId } = useParams();  // Get productId from URL
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchAllComments = async () => {
            const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(fetchedComments.filter(comment => comment.productId === productId));
        };

        fetchAllComments();
    }, [productId]);

    return (
        <>
            <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
        <div className="comments-section">
            <h2>All Reviews</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p><strong>{comment.username}</strong>: {comment.text}</p>
                            <p>Rating: {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}</p>

                            {comment.photo && <img src={comment.photo} alt="Comment" className="comment-photo" />}
                        </div>
                    ))
                )}
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default CommentsPage;