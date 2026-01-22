import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data for Charts
const data = [
    { name: 'Jan', raised: 4000 },
    { name: 'Feb', raised: 3000 },
    { name: 'Mar', raised: 2000 },
    { name: 'Apr', raised: 2780 },
    { name: 'May', raised: 1890 },
    { name: 'Jun', raised: 2390 },
    { name: 'Jul', raised: 3490 },
];

const AdminDashboard = () => {
    const [pendingCampaigns, setPendingCampaigns] = React.useState([]);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/admin/campaigns/pending');
            setPendingCampaigns(res.data);
        } catch (err) {
            console.error("Error fetching pending campaigns", err);
        }
    };

    React.useEffect(() => {
        fetchPending();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:8081/api/admin/campaigns/${id}/status?status=${status}`);
            fetchPending(); // Refresh list
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const handleDocStatusUpdate = async (docId, status) => {
        try {
            await axios.put(`http://localhost:8081/api/admin/documents/${docId}/status?status=${status}`);
            fetchPending(); // Refresh list to show updated status
        } catch (err) {
            console.error("Error updating doc status", err);
        }
    };

    return (
        <div>
            <h3 className="mb-4">Admin Dashboard</h3>

            <Row className="mb-4">
                <Col md={8}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white fw-bold">Donation Trends</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="raised" stroke="#0d6efd" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white fw-bold">Pending Verifications</Card.Header>
                        <Card.Body>
                            {pendingCampaigns.length > 0 ? pendingCampaigns.map(c => (
                                <div key={c.id} className="mb-3 border-bottom pb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h6 className="mb-0">{c.title}</h6>
                                            <small className="text-muted">{c.category} - ₹{c.goalAmount}</small>
                                        </div>
                                        <div>
                                            <Button variant="success" size="sm" className="me-1" onClick={() => handleStatusUpdate(c.id, 'ACTIVE')} title="Approve Campaign"><FaCheckCircle /></Button>
                                            <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(c.id, 'REJECTED')} title="Reject Campaign"><FaTimesCircle /></Button>
                                        </div>
                                    </div>
                                    {/* Documents List */}
                                    {c.documents && c.documents.length > 0 && (
                                        <div className="bg-light p-2 rounded small">
                                            <strong>Docs:</strong>
                                            <ul className="list-unstyled mb-0 ps-1">
                                                {c.documents.map(doc => (
                                                    <li key={doc.id} className="d-flex justify-content-between align-items-center mt-1">
                                                        <span>
                                                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                                            <span className={`badge ms-1 ${doc.status === 'VERIFIED' ? 'bg-success' : 'bg-warning'}`}>{doc.status}</span>
                                                        </span>
                                                        {doc.status === 'PENDING' && (
                                                            <div>
                                                                <Button variant="outline-success" size="sm" className="py-0 px-1 me-1" style={{ fontSize: '10px' }} onClick={() => handleDocStatusUpdate(doc.id, 'VERIFIED')}>✓</Button>
                                                                <Button variant="outline-danger" size="sm" className="py-0 px-1" style={{ fontSize: '10px' }} onClick={() => handleDocStatusUpdate(doc.id, 'REJECTED')}>✗</Button>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-muted text-center">No pending items.</p>}
                            <div className="text-center mt-3">
                                <Button variant="link" size="sm">View All</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">Platform Activity Logs</Card.Header>
                <Card.Body>
                    <Table size="sm" striped borderless>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>10:45 AM</td><td>Admin</td><td>Approved</td><td>Campaign #4521 Approved</td></tr>
                            <tr><td>10:30 AM</td><td>System</td><td>Payout</td><td>Fund transfer to Apollo Hospital</td></tr>
                            <tr><td>09:15 AM</td><td>User</td><td>Register</td><td>New Beneficiary Registration</td></tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );

};

export default AdminDashboard;
