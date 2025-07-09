import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import axios from "axios";

export default function Settings({
    currentEmail,
    onChangeEmail,
    onChangePassword
}) {
    // Local state for forms
    const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });
    const [emailMsg, setEmailMsg] = useState('');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordMsg, setPasswordMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the real user email on mount
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/user/settings/current-email', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

                // Assuming the endpoint returns the current email
            .then(res => {
                if (res.data && res.data.email) {

                    // Set the current email from the response
                    if (typeof onChangeEmail === 'function') {
                        onChangeEmail(res.data.email);
                    }
                }
            })
            .catch((err) => {
                console.error("Failed to fetch current email:", err);
                setEmailMsg("Nepodarilo sa načítať aktuálny email, skúste to neskôr.");
            });
        }
    }, []);

    const handleEmailFormChange = (e) => {
        setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailMsg("");
        try {
            const res = await api.post(
                "/settings/change-email",
                {
                    newEmail: emailForm.newEmail,
                    currentPassword: emailForm.currentPassword
                }
            );
            setEmailMsg(res.data.message || "Email address changed successfully!");
            if (onChangeEmail) onChangeEmail(emailForm.newEmail);
            setEmailForm({ newEmail: '', currentPassword: '' });

            localStorage.removeItem('token');
            navigate('/login');

        } catch (error) {
            setEmailMsg(error.response?.data?.error || "Failed to change email address.");
        }
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMsg("");
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setPasswordMsg('Please fill in all password fields.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setPasswordMsg('New passwords do not match.');
            return;
        }
        try {
            console.log('Sending to backend:', {
                currentPassword: passwords.current,
                newPassword: passwords.new,
                confirmNewPassword: passwords.confirm
            });
            const res = await api.post(
                "/settings/change-password",
                {
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                    confirmNewPassword: passwords.confirm
                }
            );
            setPasswordMsg(res.data.message || "Password changed successfully!");
            setPasswords({ current: '', new: '', confirm: '' });
            if (onChangePassword) onChangePassword();

            localStorage.removeItem('token');
            navigate('/login');

        } catch (error) {
            setPasswordMsg(error.response?.data?.error || "Failed to change password.");
        }
    };

    return (
        <div>
            <h3>Settings</h3>
            <div className="row justify-content-center" style={{maxWidth: 900, margin: '0 auto'}}>
                {/* Email Change Column */}
                <div className="col-md-6">
                    <form onSubmit={handleEmailSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Current Email Address</label>
                            <input type="email" className="form-control" value={currentEmail} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Email Address</label>
                            <input type="email" className="form-control" name="newEmail" value={emailForm.newEmail} onChange={handleEmailFormChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" name="currentPassword" value={emailForm.currentPassword} onChange={handleEmailFormChange} required />
                        </div>
                        <button type="submit" className="btn btn-secondary">Change Email</button>
                    </form>
                    {emailMsg && <div className="mb-3 alert alert-info">{emailMsg}</div>}
                </div>
                {/* Password Change Column */}
                <div className="col-md-6">
                    <form onSubmit={handlePasswordSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" name="current" value={passwords.current} onChange={handlePasswordChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" name="new" value={passwords.new} onChange={handlePasswordChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </form>
                    {passwordMsg && <div className="mt-3 alert alert-info">{passwordMsg}</div>}
                </div>
            </div>
        </div>
    );
}
