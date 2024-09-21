import React, { useState } from 'react';
import { FaEnvelope, FaKey, FaCheckCircle } from 'react-icons/fa';
import { Navbar } from '../layouts/Navbar';
import { Footer } from '../layouts/Footer';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../layouts/TopBar';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = (event) => {
        event.preventDefault();

        fetch(`http://localhost:8080/api/v1/send-otp?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setEmailSent(true);
                    setEmailError('');
                } else {
                    response.json().then((errorData) => {
                        setEmailSent(false);
                        setEmailError(errorData.message);
                    });
                }
            })
            .catch((error) => {
                setEmailSent(false);
                setEmailError('Failed to send OTP. Please try again later.');
            });
    };

    const handleOtpSubmit = (event) => {
        event.preventDefault();

        fetch(`http://localhost:8080/api/v1/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                otp: otp,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to verify OTP');
                    });
                }
            })
            .then((data) => {
                console.log(data);

                if (data.result.valid) {
                    setOtpVerified(true);
                    setOtpError('');
                } else {
                    setOtpError('Invalid or expired OTP. Please try again.');
                }
            })
            .catch((error) => {
                setOtpError(error.message);
            });
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();

        const url = `http://localhost:8080/api/v1/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: newPassword,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Password reset successfully!');
                    navigate('/login');
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to reset password');
                    });
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <TopBar/>
            <Navbar />
            <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ paddingTop: '70px', paddingBottom: '50px' }}>
                <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '500px', border: 'none', borderRadius: '15px' }}>
                    <h2 className="text-center text-primary mb-4">Forgot Password</h2>

                    {!emailSent && (
                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">
                                    <FaEnvelope className="me-2 text-primary" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {emailError && <div className="text-danger mt-2">{emailError}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                                Send OTP
                            </button>

                            <button type="button" className="btn btn-outline-secondary btn-lg w-100" onClick={() => navigate('/login')}>
                                Back to Login
                            </button>
                            
                        </form>
                    )}

                    {emailSent && !otpVerified && (
                        <form onSubmit={handleOtpSubmit} className="mt-4">
                            <h5 className="text-success">
                                <FaCheckCircle className="me-2" /> Email sent successfully! Enter your OTP below:
                            </h5>
                            <div className="mb-4 mt-3">
                                <label htmlFor="otp" className="form-label">
                                    <FaKey className="me-2 text-primary" /> OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="form-control form-control-lg"
                                    placeholder="Enter the OTP sent to your email"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                {otpError && <div className="text-danger mt-2">{otpError}</div>}
                            </div>
                            <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
                                Verify OTP
                            </button>
                            <button type="button" className="btn btn-outline-secondary btn-lg w-100" onClick={() => navigate('/login')}>
                                Back to Login
                            </button>
                        </form>
                    )}

                    {otpVerified && (
                        <form onSubmit={handlePasswordSubmit} className="mt-4">
                            <h5 className="text-success">
                                <FaCheckCircle className="me-2" /> OTP verified! Enter your new password below:
                            </h5>
                            <div className="mb-4 mt-3">
                                <label htmlFor="newPassword" className="form-label">
                                    <FaKey className="me-2 text-primary" /> New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
                                Reset Password
                            </button>
                            <button type="button" className="btn btn-outline-secondary btn-lg w-100" onClick={() => navigate('/login')}>
                                Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};
