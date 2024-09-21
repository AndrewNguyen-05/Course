import { error } from 'jquery';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from '../layouts/Footer';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';

const DepositPage = () => {
    const token = localStorage.getItem('token');
    const [selectedAmount, setSelectedAmount] = useState(null); // Giá trị được chọn
    const [customAmount, setCustomAmount] = useState(''); // Số tiền nhập thủ công

    const predefinedAmounts = [100000, 200000, 500000, 1000000]; // Các khoản tiền nạp cố định

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount(''); // Xóa ô nhập nếu người dùng chọn một giá trị cố định
    };

    const handleCustomAmountChange = (e) => {
        setSelectedAmount(null); // Hủy lựa chọn nếu người dùng nhập thủ công
        setCustomAmount(e.target.value);
    };

    const handleDeposit = () => {
        const amount = selectedAmount || customAmount;
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        fetch(`http://localhost:8080/api/v1/payment/vn-pay?amount=${amount}&bankCode=NCB`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => response.json()
        ).then(data => {
            window.location.href = data.result.paymentUrl;
        }).catch(error => console.log(error))

    };

    return (
        <div>
            <TopBar />
            <Header />
            <div className="container mt-5">
                <h2 className="mb-4">Deposit</h2>

                <div className="row">
                    {/* Hiển thị các tùy chọn nạp tiền */}
                    {predefinedAmounts.map((amount, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <button
                                className={`btn btn-lg btn-block ${selectedAmount === amount ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handleAmountClick(amount)}
                            >
                                {new Intl.NumberFormat('vi-VN').format(amount)} VND
                            </button>
                        </div>
                    ))}

                    {/* Ô nhập tiền thủ công */}
                    <div className="col-md-3 mb-3">
                        <input
                            type="number"
                            className="form-control form-control-lg"
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            min="1000" // Giới hạn tối thiểu
                        />
                    </div>
                </div>

                <button className="btn btn-success btn-lg mt-4" onClick={handleDeposit}>
                    Confirm Deposit
                </button>

                <div>
                    <ToastContainer />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DepositPage;
