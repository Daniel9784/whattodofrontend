import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
    const navigate = useNavigate();

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

    return (
        <div className="container">
            {/* Header */}
            <nav className="navbar navbar-light bg-light justify-content-between mt-3">
                <a className="navbar-brand fs-4">WhatToDoApp - Dashboard</a>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            {/* Content */}
            <div className="mt-5">
                <h2>Welcome to your dashboard!</h2>
                <p>Tu môžeš spravovať svoje úlohy a nastavenia.</p>
            </div>
        </div>
    );
}
