import React, { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./forgotPassword.css";
import NavBar from "./navBar";
import { checkRateLimit, sanitizeInput, generateCSRFToken, validateCSRFToken } from '../utils/security';

const ForgotPassword = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [csrfToken, setCsrfToken] = useState("");
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 3;

    useEffect(() => {
        // Generate CSRF token on component mount
        setCsrfToken(generateCSRFToken());
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        
        // Validate CSRF token
        if (!validateCSRFToken(csrfToken, localStorage.getItem('csrfToken'))) {
            setError("Invalid request. Please try again.");
            return;
        }

        // Check rate limiting
        const isAllowed = await checkRateLimit(auth.currentUser?.uid || 'anonymous');
        if (!isAllowed) {
            setError("Too many attempts. Please try again later.");
            return;
        }

        // Check attempt limits
        if (attempts >= MAX_ATTEMPTS) {
            setError("Maximum attempts reached. Please try again after 15 minutes.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const sanitizedEmail = sanitizeInput(email);
            await sendPasswordResetEmail(auth, sanitizedEmail);
            setMessage("Password reset link sent to your email. Please check your inbox and spam folder.");
            setAttempts(0);
        } catch (error) {
            setAttempts(prev => prev + 1);
            switch (error.code) {
                case 'auth/user-not-found':
                    setError("No account found with this email address.");
                    break;
                case 'auth/invalid-email':
                    setError("Please enter a valid email address.");
                    break;
                case 'auth/too-many-requests':
                    setError("Too many attempts. Please try again later.");
                    break;
                default:
                    setError("Error sending reset email. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="forgot-password-container">
                <h2>Reset Password</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleReset}>
                    <div className="form-group">
                        <label htmlFor="email">Enter your email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading || attempts >= MAX_ATTEMPTS}
                        />
                    </div>
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <button 
                        type="submit" 
                        className="reset-button" 
                        disabled={loading || attempts >= MAX_ATTEMPTS}
                    >
                        {loading ? "Sending..." : "Reset Password"}
                    </button>
                </form>
                <p>
                    <a href="/login">Back to Login</a>
                </p>
                {attempts > 0 && (
                    <p className="attempts-message">
                        Attempts remaining: {MAX_ATTEMPTS - attempts}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;