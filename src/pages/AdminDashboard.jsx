import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { campaignService } from '../services/api';

const AdminDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const fetchPending = async () => {
        try {
            const data = await campaignService.getPendingCampaigns();
            setCampaigns(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await campaignService.verifyCampaign(id, status);
            setMessage({ type: 'success', text: `Campaign ${status === 'ACTIVE' ? 'Approved' : 'Rejected'} successfully` });
            fetchPending(); // Refresh list
        } catch (err) {
            setMessage({ type: 'danger', text: 'Action failed. Try again.' });
        }
    };

    if (loading) return <div className="text-center py-5">Loading Dashboard...</div>;

    return (
        <Container className="py-5">
            <h2 className="mb-4 fw-bold">Admin Verification Dashboard</h2>
            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">Pending Campaigns</Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Title / Thumbnail</th>
                                <th>Story</th>
                                <th>Beneficiary</th>
                                <th>Documents</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No pending campaigns found.</td>
                                </tr>
                            ) : (
                                campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td>#{c.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={c.imageUrl} alt="" className="rounded me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <div>
                                                    <div className="fw-bold">{c.title}</div>
                                                    <small className="text-muted">{c.category} • ₹{c.goalAmount}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '250px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <small>{c.description}</small>
                                            </div>
                                        </td>
                                        <td>User #{c.beneficiaryId}</td>
                                        <td>
                                            {c.documents && c.documents.length > 0 ? (
                                                c.documents.map((doc, idx) => (
                                                    <div key={idx}>
                                                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                                                            View Doc {idx + 1}
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-muted small">No files</span>
                                            )}
                                        </td>
                                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleVerify(c.id, 'ACTIVE')}>
                                                Approve
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleVerify(c.id, 'REJECTED')}>
                                                Reject
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
