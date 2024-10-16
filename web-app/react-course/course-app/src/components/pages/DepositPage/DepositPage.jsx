import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa';

const DepositPage = () => {
    useEffect(() => {
        document.title = 'Deposit';
    }, []);

    const token = localStorage.getItem('token');
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');

    const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 4000000, 5000000];

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setSelectedAmount(null);
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
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = data.result.paymentUrl;
            })
            .catch(error => console.log(error));
    };

    return (
        <div className='deposit-page'>
            <div className="container mt-5 deposit-container">
                <h2 className="mb-4 text-center deposit-title">
                    <FaMoneyBillWave className="mr-2" /> Deposit Funds
                </h2>

                <div className="row">
                    {predefinedAmounts.map((amount, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <button
                                className={`btn btn-lg btn-block deposit-button ${selectedAmount === amount ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handleAmountClick(amount)}
                            >
                                {new Intl.NumberFormat('vi-VN').format(amount)} VND
                            </button>
                        </div>
                    ))}

                    <div className="col-md-3 mb-3">
                        <input
                            type="number"
                            className="form-control form-control-lg deposit-input"
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            min="1000"
                        />
                    </div>
                </div>

                <button className="btn btn-success btn-lg mt-4 deposit-confirm-button" onClick={handleDeposit}>
                    <FaPlusCircle className="mr-2" /> Confirm Deposit
                </button>

                <ToastContainer />
            </div>
        </div>
    );
};

export default DepositPage;
