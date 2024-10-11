import React, { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../api';
import { useNavigate } from 'react-router-dom';
import "./PasswordReset.css"
const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        try {
            await requestPasswordReset(email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            setMessage('Error sending reset email.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(token, newPassword);
            setMessage('Password has been reset successfully!');
            navigate('/login');
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <form onSubmit={handleRequestReset}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Request Password Reset</button>
            </form>
            <form onSubmit={handleResetPassword}>
                <div>
                    <label>Token</label>
                    <input 
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <div>{message}</div>}
        </div>
    );
};

export default PasswordReset;
