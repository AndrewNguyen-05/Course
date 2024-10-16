import React, { useEffect, useState } from "react";
import { SidebarAdmim } from "../layouts/SidebarAdmin";
import { AdminHeader } from "../layouts/HeaderAdmin";
import { Footer } from "../../layouts/Footer";
import { Button, Table, Badge, Spinner, Container, Row, Col, Modal } from "react-bootstrap";
import { FaCertificate, FaCheck, FaFacebook, FaFilePdf, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

export const RegistrationList = () => {
    const [listRegister, setListRegister] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State for Confirming Approve/Reject
    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [actionType, setActionType] = useState('');

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

    const handleActionClick = (teacher, action) => {
        setSelectedTeacher(teacher);
        setActionType(action);
        setShowModal(true);
    };

    const handleConfirmAction = () => {
        console.log(`${actionType} for`, selectedTeacher);
        setShowModal(false);
    };

    return (
        <div className="registration-container d-flex flex-column min-vh-100 bg-light">
            <div className="d-flex flex-grow-1">
                <SidebarAdmim />

                <div className="content-wrapper flex-grow-1">
                    <AdminHeader />
                    <Container fluid className="mt-4">
                        <Row>
                            <Col>
                                <h2 className="registration-title mb-4 text-center text-primary">Teacher Registrations</h2>
                                {loading && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
                                {error && <p className="text-center text-danger">Error: {error}</p>}
                                <div className="registration-table-container bg-white shadow p-5 rounded">
                                    <Table striped bordered hover responsive className="registration-table table-hover shadow-sm">
                                        <thead className="bg-primary text-white">
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
                                                    <tr key={index} className="align-middle">
                                                        <td>
                                                            <Badge bg="info" className="registration-badge p-2">{teacher.email}</Badge>
                                                        </td>
                                                        <td>{teacher.name}</td>
                                                        <td>
                                                            <Badge bg="warning" className="registration-badge p-2">{teacher.phone}</Badge>
                                                        </td>
                                                        <td>
                                                            <Link to={teacher.fbLink} target="_blank" className="registration-link text-primary">
                                                                <FaFacebook /> Facebook
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                className="btn-custom btn-lg rounded-pill shadow-sm"
                                                                onClick={() => handleOpenInNewTab(teacher.cvUrl)}
                                                            >
                                                                <FaFilePdf /> View CV
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="outline-secondary"
                                                                className="btn-custom btn-lg rounded-pill shadow-sm"
                                                                onClick={() => handleOpenInNewTab(teacher.certificate)}
                                                            >
                                                                <FaCertificate /> View Certificate
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="outline-success"
                                                                className="btn-custom me-2 btn-lg rounded-pill shadow-sm"
                                                                onClick={() => handleActionClick(teacher, 'approve')}
                                                            >
                                                                <FaCheck /> Approve
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                className="btn-custom btn-lg rounded-pill shadow-sm"
                                                                onClick={() => handleActionClick(teacher, 'reject')}
                                                            >
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
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm {actionType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === 'approve' ? (
                        <p>Are you sure you want to approve this registration?</p>
                    ) : (
                        <p>Are you sure you want to reject this registration?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant={actionType === 'approve' ? 'success' : 'danger'} onClick={handleConfirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
