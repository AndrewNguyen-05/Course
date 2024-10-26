import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AssignmentManager = () => {
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ questionText: '', type: 'multiple-choice', options: [], correctAnswer: '' });

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setNewAssignment({ title: '', description: '', dueDate: '' });
        setQuestions([]);
    };

    const handleCreateAssignment = () => {
        const assignment = { ...newAssignment, questions: [...questions] };
        setAssignments([...assignments, assignment]);
        handleCloseModal();
    };

    const handleDeleteAssignment = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this assignment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                setAssignments(assignments.filter((_, i) => i !== index));
            }
        });
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { ...newQuestion }]);
        setNewQuestion({ questionText: '', type: 'multiple-choice', options: [], correctAnswer: '' });
    };

    return (
        <div className="assignment-manager">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Assignments</h2>
                <Button variant="primary" onClick={handleOpenModal}>
                    <FaPlus /> Add Assignment
                </Button>
            </div>

            <ListGroup>
                {assignments.map((assignment, index) => (
                    <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{assignment.title}</h5>
                                <p>{assignment.description}</p>
                                <small>Due Date: {assignment.dueDate}</small>
                            </div>
                            <div>
                                <Button variant="warning" className="me-2"><FaEdit /> Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteAssignment(index)}><FaTrashAlt /> Delete</Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Modal for creating new assignment */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter assignment title"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newAssignment.dueDate}
                                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                            />
                        </Form.Group>
                        <h5>Add Questions</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter question text"
                                value={newQuestion.questionText}
                                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Question Type</Form.Label>
                            <Form.Select
                                value={newQuestion.type}
                                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                            >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="short-answer">Short Answer</option>
                                <option value="true-false">True/False</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="secondary" onClick={handleAddQuestion}>
                            Add Question
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateAssignment}>
                        Save Assignment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AssignmentManager;
