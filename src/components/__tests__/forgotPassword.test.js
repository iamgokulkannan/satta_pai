import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import ForgotPassword from '../forgotPassword';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    sendPasswordResetEmail: jest.fn()
}));

// Mock security utilities
jest.mock('../../utils/security', () => ({
    checkRateLimit: jest.fn().mockResolvedValue(true),
    sanitizeInput: jest.fn(input => input),
    generateCSRFToken: jest.fn().mockReturnValue('test-token'),
    validateCSRFToken: jest.fn().mockReturnValue(true)
}));

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('ForgotPassword Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders forgot password form', () => {
        renderWithRouter(<ForgotPassword />);
        
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter your email:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    });

    it('handles successful password reset request', async () => {
        sendPasswordResetEmail.mockResolvedValueOnce();
        
        renderWithRouter(<ForgotPassword />);
        
        const emailInput = screen.getByLabelText('Enter your email:');
        const submitButton = screen.getByRole('button', { name: 'Reset Password' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/Password reset link sent to your email/i)).toBeInTheDocument();
        });
        
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(
            expect.anything(),
            'test@example.com'
        );
    });

    it('handles invalid email error', async () => {
        sendPasswordResetEmail.mockRejectedValueOnce({ code: 'auth/invalid-email' });
        
        renderWithRouter(<ForgotPassword />);
        
        const emailInput = screen.getByLabelText('Enter your email:');
        const submitButton = screen.getByRole('button', { name: 'Reset Password' });
        
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
        });
    });

    it('handles user not found error', async () => {
        sendPasswordResetEmail.mockRejectedValueOnce({ code: 'auth/user-not-found' });
        
        renderWithRouter(<ForgotPassword />);
        
        const emailInput = screen.getByLabelText('Enter your email:');
        const submitButton = screen.getByRole('button', { name: 'Reset Password' });
        
        fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('No account found with this email address.')).toBeInTheDocument();
        });
    });

    it('enforces rate limiting', async () => {
        const { checkRateLimit } = require('../../utils/security');
        checkRateLimit.mockRejectedValueOnce();
        
        renderWithRouter(<ForgotPassword />);
        
        const emailInput = screen.getByLabelText('Enter your email:');
        const submitButton = screen.getByRole('button', { name: 'Reset Password' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Too many attempts. Please try again later.')).toBeInTheDocument();
        });
    });

    it('disables form after maximum attempts', async () => {
        sendPasswordResetEmail.mockRejectedValue({ code: 'auth/invalid-email' });
        
        renderWithRouter(<ForgotPassword />);
        
        const emailInput = screen.getByLabelText('Enter your email:');
        const submitButton = screen.getByRole('button', { name: 'Reset Password' });
        
        // Make 3 failed attempts
        for (let i = 0; i < 3; i++) {
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
            });
        }
        
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Maximum attempts reached. Please try again after 15 minutes.')).toBeInTheDocument();
    });
}); 