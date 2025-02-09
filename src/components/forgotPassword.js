import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import NavBar from "./navBar";

const ForgotPassword = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link sent to your email.");
        } catch (error) {
            setError("Error sending reset email. Please check the email address.");
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
                        />
                    </div>
                    <button type="submit" className="reset-button" disabled={loading}>
                        {loading ? "Sending..." : "Reset Password"}
                    </button>
                </form>
                <p>
                    <a href="/login">Back to Login</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;