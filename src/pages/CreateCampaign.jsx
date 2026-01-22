import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { FaUpload, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            navigate('/dashboard'); // Direct to dashboard after "creation"
        }, 2000);
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-5">
                            <h2 className="mb-4 fw-bold text-center">Start a New Campaign</h2>

                            {submitted ? (
                                <Alert variant="success" className="text-center">
                                    <FaCheck size={30} className="mb-2 d-block mx-auto" />
                                    <strong>Submitted Successfully!</strong><br />
                                    Your campaign is under verification. You will be notified once approved.
                                </Alert>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <Form.Label>Campaign Title</Form.Label>
                                            <Form.Control type="text" placeholder="e.g. Help Rahul with College Fees" required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select required>
                                                <option value="">Select Category</option>
                                                <option value="Education">Education</option>
                                                <option value="Medical">Medical</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Goal Amount (₹)</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>₹</InputGroup.Text>
                                                <Form.Control type="number" placeholder="50000" required />
                                            </InputGroup>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <Form.Label>Campaign Story / Description</Form.Label>
                                            <Form.Control as="textarea" rows={6} placeholder="Describe the need, the beneficiary, and how the funds will be used..." required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control type="date" required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Beneficiary Location</Form.Label>
                                            <Form.Control type="text" placeholder="City, State" required />
                                        </Col>

                                        <Col md={12} className="mb-4">
                                            <Form.Label>Upload Verification Documents</Form.Label>
                                            <div className="border border-2 border-dashed rounded p-4 text-center bg-light">
                                                <FaUpload className="text-muted mb-2" size={24} />
                                                <p className="mb-2 text-muted">Drag & drop files here or click to upload</p>
                                                <small className="text-muted d-block mb-3">(Medical Reports, Fee Structure, ID Proof)</small>
                                                <Form.Control type="file" multiple />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="d-grid gap-2">
                                        <Button variant="primary" size="lg" type="submit">
                                            Submit for Verification
                                        </Button>
                                        <Button variant="light" onClick={() => navigate('/dashboard')}>Cancel</Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateCampaign;
