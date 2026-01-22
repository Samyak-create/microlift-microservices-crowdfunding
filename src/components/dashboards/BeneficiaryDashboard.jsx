import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaTimesCircle, FaFileUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BeneficiaryDashboard = () => {
    const [campaigns, setCampaigns] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/beneficiary/campaigns');
                setCampaigns(response.data);
            } catch (error) {
                console.error("Error fetching campaigns", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Beneficiary Dashboard</h3>
                <Link to="/create-campaign" className="btn btn-primary"><FaPlus className="me-2" /> Create Campaign</Link>
            </div>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="border-warning border-2 shadow-sm mb-3">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <FaTimesCircle className="text-warning fs-3 me-3" />
                                <div>
                                    <h5 className="mb-1">Verification Status: Pending</h5>
                                    <p className="mb-0 small text-muted">Please upload your Aadhar Card and Income Certificate for approval.</p>
                                </div>
                            </div>
                            <Button variant="outline-dark" size="sm"><FaFileUpload className="me-2" /> Upload Docs</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white fw-bold">My Campaigns & Document Status</Card.Header>
                <Card.Body>
                    {loading ? <p>Loading...</p> : (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Goal</th>
                                    <th>Raised</th>
                                    <th>Status</th>
                                    <th>Documents</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.length > 0 ? campaigns.map(campaign => (
                                    <tr key={campaign.id}>
                                        <td>{campaign.title}</td>
                                        <td>₹{campaign.goalAmount}</td>
                                        <td>₹{campaign.raisedAmount}</td>
                                        <td><Badge bg={campaign.status === 'ACTIVE' ? 'success' : (campaign.status === 'PENDING' ? 'warning' : 'secondary')}>{campaign.status}</Badge></td>
                                        <td>
                                            {campaign.documents && campaign.documents.length > 0 ? (
                                                <ul className="list-unstyled mb-0 small">
                                                    {campaign.documents.map(doc => (
                                                        <li key={doc.id} className="d-flex align-items-center mb-1">
                                                            <span className="me-2">{doc.name}:</span>
                                                            <Badge bg={doc.status === 'VERIFIED' ? 'success' : (doc.status === 'PENDING' ? 'warning' : 'danger')}>
                                                                {doc.status}
                                                            </Badge>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <span className="text-muted small">No documents uploaded</span>}
                                        </td>
                                        <td style={{ width: '25%' }}>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2 small">{Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%</span>
                                                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                    <div className="progress-bar bg-success" style={{ width: `${(campaign.raisedAmount / campaign.goalAmount) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="6" className="text-center">No campaigns found.</td></tr>}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default BeneficiaryDashboard;
