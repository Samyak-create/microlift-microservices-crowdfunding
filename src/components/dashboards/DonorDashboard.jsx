import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import axios from 'axios';

const DonorDashboard = () => {
    const [donations, setDonations] = React.useState([]);
    const [stats, setStats] = React.useState({ total: 0, count: 0 });

    React.useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/donor/donations');
                setDonations(res.data);
                const total = res.data.reduce((acc, curr) => acc + curr.amount, 0);
                setStats({ total, count: res.data.length });
            } catch (err) {
                console.error("Error fetching donations", err);
            }
        };
        fetchDonations();
    }, []);

    return (
        <div>
            <h3 className="mb-4">Donor Dashboard</h3>
            <Row className="g-4 mb-4">
                <Col md={4}>
                    <Card className="bg-primary text-white border-0 shadow-sm">
                        <Card.Body>
                            <h5>Total Donated</h5>
                            <h2>₹{stats.total}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="bg-success text-white border-0 shadow-sm">
                        <Card.Body>
                            <h5>Donations Count</h5>
                            <h2>{stats.count}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="bg-info text-white border-0 shadow-sm">
                        <Card.Body>
                            <h5>Active Donations</h5>
                            <h2>{donations.filter(d => d.campaign && d.campaign.status === 'ACTIVE').length}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white fw-bold">Donation History</Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Campaign</th>
                                <th>Amount</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length > 0 ? donations.map(d => (
                                <tr key={d.id}>
                                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td>{d.campaign ? d.campaign.title : 'Unknown'}</td>
                                    <td>₹{d.amount}</td>
                                    <td><Button variant="link" size="sm">Download</Button></td>
                                </tr>
                            )) : <tr><td colSpan="4" className="text-center">No donations yet.</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default DonorDashboard;
