import React, { useEffect, useState } from "react";
import { SidebarAdmim } from "../layouts/SidebarAdmin";
import { AdminHeader } from "../layouts/HeaderAdmin";
import { Footer } from "../../layouts/Footer";
import { Button, Table } from "react-bootstrap";
import { FaCertificate, FaCheck, FaFacebook, FaFilePdf, FaTimes } from "react-icons/fa";

export const RegistrationList = () => {
    const [listRegister, setListRegister] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/registration-teachers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setListRegister(data.result);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenInNewTab = (url) => {
        const fullUrl = `http://localhost:8080${url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-grow-1">
                <SidebarAdmim />

                <div className="content-wrapper flex-grow-1">
                    <AdminHeader />
                    <div className="container mt-4">
                        <h2 className="mb-4 text-center">Teacher Registrations</h2>
                        {loading && <p className="text-center">Loading...</p>}
                        {error && <p className="text-center text-danger">Error: {error}</p>}
                        <div className="table-container">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Facebook</th>
                                        <th>CV</th>
                                        <th>Certificate</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listRegister.length > 0 ? (
                                        listRegister.map((teacher, index) => (
                                            <tr key={index}>
                                                <td>{teacher.email}</td>
                                                <td>{teacher.name}</td>
                                                <td>{teacher.phone}</td>
                                                <td>
                                                    <a
                                                        href={teacher.fbLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <FaFacebook /> Facebook
                                                    </a>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        className="btn-custom"
                                                        onClick={() => handleOpenInNewTab(teacher.cvUrl)}
                                                    >
                                                        <FaFilePdf /> View CV
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="secondary"
                                                        className="btn-custom"
                                                        onClick={() => handleOpenInNewTab(teacher.certificate)}
                                                    >
                                                        <FaCertificate /> View Certificate
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="success" className="me-2">
                                                        <FaCheck /> Approve
                                                    </Button>
                                                    <Button variant="danger">
                                                        <FaTimes /> Reject
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No registrations found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
