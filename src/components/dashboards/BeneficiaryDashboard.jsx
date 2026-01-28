import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { campaignService } from '../services/api';

const BeneficiaryDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (user?.id) {
                try {
                    const data = await campaignService.getCampaignsByBeneficiary(user.id);
                    setCampaigns(data);
                } catch (err) {
                    console.error("Failed to fetch campaigns", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCampaigns();
    }, [user]);

    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

    return (
        <div>
            <h2 className="mb-4 fw-bold">My Beneficiary Dashboard</h2>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-primary text-white">
                        <Card.Body className="py-4">
                            <h3>₹{totalRaised.toLocaleString()}</h3>
                            <p className="mb-0">Total Funds Received</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body className="py-4">
                            <h3>{campaigns.length}</h3>
                            <p className="text-muted mb-0">Total Campaigns</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 d-flex align-items-center justify-content-center" style={{ minHeight: '120px' }}>
                        <Button variant="outline-primary" onClick={() => navigate('/create-campaign')}>
                            + Start New Campaign
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">My Campaigns</Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Campaign</th>
                                <th>Status</th>
                                <th>Goal</th>
                                <th>Raised</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : campaigns.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No campaigns found. Start one today!</td></tr>
                            ) : (
                                campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="fw-bold">{c.title}</div>
                                            <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                        </td>
                                        <td>
                                            <Badge bg={
                                                c.status === 'ACTIVE' ? 'success' :
                                                    c.status === 'REJECTED' ? 'danger' :
                                                        c.status === 'COMPLETED' ? 'info' : 'warning'
                                            }>
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td>₹{c.goalAmount.toLocaleString()}</td>
                                        <td>₹{c.raisedAmount.toLocaleString()}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                                                <div className="progress flex-grow-1" style={{ height: '5px', width: '80px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default BeneficiaryDashboard;
