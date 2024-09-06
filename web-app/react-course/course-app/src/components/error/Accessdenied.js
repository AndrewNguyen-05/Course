// src/pages/Accessdenied.js

import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdErrorOutline } from 'react-icons/md';

export const Accessdenied = () => {
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(interval);
                    navigate('/home');
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 p-4">
            <div className="text-center">
                <Alert variant="danger" className="shadow-lg p-4 rounded">
                    <MdErrorOutline size={64} color="red" className="mb-3" />
                    <Alert.Heading className="display-4">403 - Access Denied</Alert.Heading>
                    <p className="lead mb-4">
                        You do not have permission to access this page.
                    </p>
                    <hr />
                    <p className="lead mb-4">
                        You will be redirected to the homepage in <span className="fw-bold">{countdown}</span> seconds.
                    </p>
                    <Button variant="danger" size="lg" onClick={() => navigate('/home')}>
                        Go Back Now
                    </Button>
                </Alert>
            </div>
        </Container>
    );
};
