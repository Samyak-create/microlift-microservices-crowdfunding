import React from 'react';
import { Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CampaignCard = ({ id, image, title, description, category, raised, goal, location, verified }) => {
    const percent = Math.min(100, Math.round((raised / goal) * 100));

    return (
        <Card className="h-100 overflow-hidden">
            <div className="position-relative">
                <Card.Img variant="top" src={image} style={{ height: '200px', objectFit: 'cover' }} />
                <Badge bg={category === 'EDUCATION' ? 'info' : 'danger'} className="position-absolute top-0 end-0 m-3 shadow-sm">
                    {category}
                </Badge>
            </div>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted d-flex align-items-center">
                        <FaMapMarkerAlt className="me-1" /> {location}
                    </small>
                    {verified && (
                        <Badge bg="success" pill className="d-flex align-items-center">
                            <FaCheckCircle className="me-1" /> Verified
                        </Badge>
                    )}
                </div>
                <Card.Title className="fw-bold mb-2 text-truncate" title={title}>{title}</Card.Title>
                <Card.Text className="text-muted small mb-3 flex-grow-1">
                    {description.length > 80 ? description.substring(0, 80) + '...' : description}
                </Card.Text>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                        <span>Raised: ₹{raised.toLocaleString()}</span>
                        <span className="text-muted">Goal: ₹{goal.toLocaleString()}</span>
                    </div>
                    <ProgressBar now={percent} variant="success" className="mb-3" style={{ height: '8px' }} />

                    <Link to={`/campaigns/${id}`} className="d-block">
                        <Button variant="outline-primary" className="w-100 fw-medium">
                            Donate Now
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CampaignCard;
