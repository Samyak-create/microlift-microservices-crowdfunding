import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <h2 className="mb-4">My Donor Dashboard</h2>
            <Card className="p-5 shadow-sm border-0">
                <Card.Body>
                    <h4>Thank you for your generosity!</h4>
                    <p className="text-muted">You have registered as a Donor. Explore campaigns and make a difference today.</p>
                    <Button variant="primary" size="lg" onClick={() => navigate('/campaigns')}>Explore Campaigns</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default DonorDashboard;
