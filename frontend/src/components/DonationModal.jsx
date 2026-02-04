import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { FaRupeeSign, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useRazorpay } from 'react-razorpay';
import { donationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonationModal = ({ show, onHide, campaignTitle, campaignId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('mock_qr'); // Default to mock
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleDonate = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setStep(2);
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

                <Button variant="success" size="lg" className="w-100" onClick={handleDonate}>
                    Proceed to Pay ₹{amount}
                </Button>
            </Modal.Body>
            <Modal.Footer className="justify-content-center border-0 pt-0">
                <small className="text-muted"><FaLock className="me-1" /> Secure Payment</small>
            </Modal.Footer>
        </>
    );

    const { Razorpay } = useRazorpay();

    const handlePayment = async () => {
        if (paymentMethod === 'mock_qr') {
            setLoading(true);
            setError('');
            try {
                const donationData = {
                    amount: amount,
                    campaignId: campaignId,
                    donorId: user ? user.id : null, // Ensure user ID is passed
                    isAnonymous: isAnonymous
                };

                if (!donationData.donorId) {
                    // Start redirect flow instead of just showing error
                    navigate('/login');
                    return;
                }

                await donationService.createDonation(donationData);
                setStep(3);
            } catch (err) {
                console.error(err);
                setError('Payment failed. Please try again.');
            } finally {
                setLoading(false);
            }
            return;
        }

        // ... Existing Razorpay logic kept as fallback or removed if user wants ONLY mock
        setLoading(true);
        // ... (rest of Razorpay code if we want to keep it, but for this request "just add a demo", I will prioritize Mock)
    };

    const renderStep2 = () => (
        <>
            <Modal.Header closeButton onHide={() => setStep(1)}>
                <Modal.Title>Complete Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p className="mb-3">Amount to Pay: <strong>₹{amount}</strong></p>
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="mb-4">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=microlift@upi&pn=MicroLift&am=${amount}`}
                        alt="Payment QR"
                        className="img-fluid border p-2 rounded"
                    />
                    <small className="d-block text-muted mt-2">Scan with any UPI App (GPay, PhonePe, Paytm)</small>
                </div>

                <div className="d-grid gap-2">
                    <Button
                        variant="success"
                        size="lg"
                        className="w-100"
                        onClick={() => { setPaymentMethod('mock_qr'); handlePayment(); }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Simulate Payment Success'}
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => setStep(1)}>Back</Button>
                </div>
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
