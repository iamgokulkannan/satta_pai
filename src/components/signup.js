import React, { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import NavBar from './navBar';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase if it hasn't been initialized already
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Check if this is the first user (admin)
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const isFirstUser = usersSnapshot.empty;
    
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                phone: phone,
                uid: user.uid,
                isAdmin: isFirstUser // First user becomes admin
            });
    
            alert('User signed up successfully!');
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
    
            await setDoc(doc(db, 'users', user.uid), {
                username: user.displayName || '',
                email: user.email,
                phone: user.phoneNumber || '',
                uid: user.uid,
            }, { merge: true });
    
            // alert('Signed in with Google!');
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="signup-container">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={handleGoogleSignIn} className="google-signin-button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>
            </div>
        </div>
    );
};

export default Signup;
