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
            setCampaigns(Array.isArray(data) ? data : []);
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
        } catch {
            setMessage({ type: 'danger', text: 'Action failed. Try again.' });
        }
    };

    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const handleViewUser = async (userId) => {
        try {
            const { authService } = await import('../services/api');
            const user = await authService.getUserById(userId);
            setSelectedUser(user);
            setShowUserModal(true);
        } catch (e) {
            alert('Failed to fetch user details');
        }
    };

    const handleUserVerify = async (status) => {
        if (!selectedUser) return;
        try {
            const { authService } = await import('../services/api');
            await authService.verifyUser(selectedUser.id, status);
            alert(`User ${status === 'VERIFIED' ? 'Verified' : 'Rejected'}!`);
            setShowUserModal(false);
            // Optionally refresh user data
        } catch (e) {
            alert('Action Failed');
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
                            {!Array.isArray(campaigns) || campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">No pending campaigns found.</td>
                                </tr>
                            ) : (
                                campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td>#{c.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={c.imageUrl || "https://via.placeholder.com/50"} alt={c.title || "Campaign Thumbnail"} className="rounded me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <div>
                                                    <div className="fw-bold">{c.title || "Untitled"}</div>
                                                    <small className="text-muted">{c.category} • ₹{c.goalAmount}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '250px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <small>{c.description}</small>
                                            </div>
                                        </td>
                                        <td>
                                            User #{c.beneficiaryId}
                                            <Button variant="link" size="sm" onClick={() => handleViewUser(c.beneficiaryId)}>View User</Button>
                                        </td>
                                        <td>
                                            {Array.isArray(c.documents) && c.documents.length > 0 ? (
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
                                        <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleVerify(c.id, 'ACTIVE')}>
                                                Approve Campaign
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleVerify(c.id, 'REJECTED')}>
                                                Reject This
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Verify Beneficiary: {selectedUser.fullName}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUserModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                                <p><strong>Current Status:</strong> <Badge bg={selectedUser.kycStatus === 'VERIFIED' ? 'success' : 'warning'}>{selectedUser.kycStatus || 'PENDING'}</Badge></p>
                                <hr />
                                <h6>KYC Document:</h6>
                                {selectedUser.kycDocumentUrl ? (
                                    selectedUser.kycDocumentUrl.startsWith('http') ? (
                                        <img src={selectedUser.kycDocumentUrl} alt="KYC" className="img-fluid rounded border" />
                                    ) : (
                                        <img src={`http://localhost:8080/api/auth/kyc-files/${selectedUser.kycDocumentUrl.replace("uploads/", "")}`} alt="KYC" className="img-fluid rounded border" />
                                    )
                                ) : (
                                    <Alert variant="warning">No KYC Document Uploaded</Alert>
                                )}
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowUserModal(false)}>Close</Button>
                                <Button variant="danger" onClick={() => handleUserVerify('REJECTED')}>Reject User</Button>
                                <Button variant="success" onClick={() => handleUserVerify('VERIFIED')}>Verify User</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default AdminDashboard;
