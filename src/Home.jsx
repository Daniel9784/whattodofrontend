// Home.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container">
            {/* Header */}
            <nav className="navbar navbar-light bg-light justify-content-between mt-3">
                <a className="navbar-brand fs-4">WhatToDoApp</a>
                <div>
                    <Link to="/register" className="btn btn-outline-primary me-2">Register</Link>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                </div>
            </nav>

            {/* Body */}
            <div className="text-center mt-5">
                <img
                    src="/vite.svg"
                    alt="Placeholder"
                    className="img-fluid mb-4"
                />
                <h2>Welcome to WhatToDoApp!</h2>
                <p>This app helps you organize your daily tasks easily.</p>
            </div>
        </div>
    );
}
