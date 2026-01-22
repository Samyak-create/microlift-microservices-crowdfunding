import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 font-sans">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Container className="py-5 text-center"><h1>404: Page Not Found</h1></Container>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
