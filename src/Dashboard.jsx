import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddNote from './components/AddNote';
import SeeAllNotes from './components/SeeAllNotes';
import Calendar from './components/Calendar';
import Settings from './components/Settings';


export default function Dashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('addNote');
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Content for each section
    const renderSection = () => {
        switch (activeSection) {
            case 'addNote':
                return <AddNote />;
            case 'seeAllNotes':
                return <SeeAllNotes />;
            case 'calendar':
                return <Calendar />;
            case 'settings':
                return <Settings currentEmail={currentEmail} onChangeEmail={setCurrentEmail} />;
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid p-0">
            {/* Colorful Header */}
            <div className="p-4 d-flex justify-content-between align-items-center" style={{background: '#b0b0b0'}}>
                <span className="navbar-brand fs-3 text-black">WhatToDoApp - Dashboard</span>
                <button className="btn btn-warning fw-bold" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Top Navigation Buttons */}
            <div className="bg-light py-3 px-4 border-bottom d-flex gap-3">
                <button className={`btn btn-outline-primary${activeSection === 'addNote' ? ' active' : ''}`} onClick={() => setActiveSection('addNote')}>Add Note</button>
                <button className={`btn btn-outline-primary${activeSection === 'seeAllNotes' ? ' active' : ''}`} onClick={() => setActiveSection('seeAllNotes')}>See All Notes</button>
                <button className={`btn btn-outline-primary${activeSection === 'calendar' ? ' active' : ''}`} onClick={() => setActiveSection('calendar')}>Calendar</button>
                <button className={`btn btn-outline-secondary${activeSection === 'settings' ? ' active' : ''}`} onClick={() => setActiveSection('settings')}>Settings</button>
            </div>

            {/* Main Content Area */}
            <div className="container mt-4">
                <div className="p-4 bg-light rounded shadow-sm min-vh-50">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}
