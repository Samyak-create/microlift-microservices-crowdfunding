import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { FaRupeeSign, FaLock, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonationModal = ({ show, onHide, campaignTitle, campaignId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleDonate = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const donationData = {
                amount: amount,
                campaignId: campaignId,
                paymentMethod: paymentMethod,
                isAnonymous: isAnonymous
            };

            await axios.post('http://localhost:8081/api/donor/donations', donationData);
            setStep(3);
        } catch (err) {
            console.error(err);
            setError('Donation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountSelect = (val) => {
        setAmount(val);
        setCustomAmount('');
    }

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount(Number(e.target.value));
    }

    const renderStep1 = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Make a Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted mb-3">Donating to: <strong>{campaignTitle}</strong></p>

                <Form.Label className="fw-bold">Choose Amount</Form.Label>
                <div className="d-flex gap-2 mb-3 flex-wrap">
                    {[500, 1000, 2500, 5000].map((val) => (
                        <Button
                            key={val}
                            variant={amount === val && !customAmount ? "primary" : "outline-primary"}
                            onClick={() => handleAmountSelect(val)}
                        >
                            ₹{val}
                        </Button>
                    ))}
                </div>

                <InputGroup className="mb-4">
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                    />
                </InputGroup>

                <Form.Check
                    type="checkbox"
                    label="Make this donation anonymous"
                    id="anonymous-check"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mb-3 text-muted small"
                />

                <Button variant="success" size="lg" className="w-100" onClick={() => setStep(2)}>
                    Proceed to Pay ₹{amount}
                </Button>
            </Modal.Body>
            <Modal.Footer className="justify-content-center border-0 pt-0">
                <small className="text-muted"><FaLock className="me-1" /> Secure Payment</small>
            </Modal.Footer>
        </>
    );

    const renderStep2 = () => (
        <>
            <Modal.Header closeButton onHide={() => setStep(1)}>
                <Modal.Title>Select Payment Method</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-3">Amount to Pay: <strong>₹{amount}</strong></p>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form className="d-grid gap-3">
                    <div className={`p-3 border rounded cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-light' : ''}`} onClick={() => setPaymentMethod('upi')}>
                        <Form.Check
                            type="radio"
                            label="UPI (GPay, PhonePe, Paytm)"
                            name="payment"
                            id="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                        />
                    </div>
                    <div className={`p-3 border rounded cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`} onClick={() => setPaymentMethod('card')}>
                        <Form.Check
                            type="radio"
                            label="Credit / Debit Card"
                            name="payment"
                            id="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                        />
                    </div>
                </Form>

                <Button
                    variant="success"
                    size="lg"
                    className="w-100 mt-4"
                    onClick={handleDonate}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : `Pay ₹${amount}`}
                </Button>
            </Modal.Body>
        </>
    );

    const renderStep3 = () => (
        <>
            <Modal.Body className="text-center py-5">
                <div className="mb-4 text-success">
                    <FaCheckCircle size={60} />
                </div>
                <h3 className="fw-bold mb-3">Thank You!</h3>
                <p className="text-muted mb-4">
                    Your donation of <strong>₹{amount}</strong> was successful. <br />
                    You have made a big difference today.
                </p>
                <Button variant="primary" onClick={onHide}>Close</Button>
            </Modal.Body>
        </>
    );

    return (
        <Modal show={show} onHide={onHide} centered>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </Modal>
    );
};

export default DonationModal;
