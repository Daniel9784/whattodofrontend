import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setIsLoggedIn }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("/login", form);
            const data = res.data;

            if (res.status === 200 && data.token) {
                localStorage.setItem("token", data.token);
                setMessage("Login successful!");
                setIsLoggedIn(true);          // ← nastavenie stavu v App.jsx
                navigate("/dashboard");       // ← presmerovanie
            } else {
                setMessage(data.error || "Login failed");
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.error || "Network error");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <button type="submit">Login</button>

            {message && <p>{message}</p>}
        </form>
    );
}
