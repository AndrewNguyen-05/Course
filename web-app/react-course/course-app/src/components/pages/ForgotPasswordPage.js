import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaKey, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { resetPassword, sendOtp, verifyOtp } from '../../service/UserService';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

export const ForgotPassword = () => {

    useEffect(() => {
        document.title = 'Forgot Password'
    })

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        try {
            await sendOtp(email);
            setEmailSent(true);
            setEmailError('');
        } catch (error) {
            setEmailSent(false);
            setEmailError(error.message || 'Failed to send OTP. Please try again later.');
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await verifyOtp(email, otp);
            if (data.result.valid) {
                setOtpVerified(true);
                setOtpError('');
            } else {
                setOtpError('Invalid or expired OTP. Please try again.');
            }
        } catch (error) {
            setOtpError(error.message);
        }
    };

    const showAlert = (isSuccess, message) => {
        const alertOptions = {
            title: isSuccess ? 'Success!' : 'Error!',
            text: message,
            icon: isSuccess ? 'success' : 'error',
            confirmButtonText: 'OK',
        };

        return Swal.fire(alertOptions); // Trả về promise
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        try {
            await resetPassword(email, otp, newPassword);
            showAlert(true, 'Password reset successfully!').then(() => {
                navigate('/login');
            });
        } catch (error) {
            showAlert(false, error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} // Hiệu ứng khi trang bắt đầu: mờ và dịch xuống
            animate={{ opacity: 1, y: 0 }}  // Hiệu ứng khi trang hiện ra: hiện và dịch lên
            exit={{ opacity: 0, y: 50 }}     // Hiệu ứng khi rời khỏi trang: mờ và dịch xuống
            transition={{ duration: 0.5 }}   // Thời gian chuyển đổi hiệu ứng
            className="content-page"
        >
            <div className="d-flex flex-column forgot-password">
                <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ paddingTop: '70px', paddingBottom: '50px' }}>
                    <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '600px', border: 'none', borderRadius: '15px' }}>
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
            </div>
        </motion.div>
    );
};
