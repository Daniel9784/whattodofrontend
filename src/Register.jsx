import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // vytvor navigaciu

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("/register", form);
            const data = res.data;
            if (res.status === 200) {
                setMessage(data.message);
                // presmerovanie po uspesnej registracii
                navigate("/login");
            } else {
                setMessage(data.error || "Registration failed");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
            <button type="submit">Register</button>
            <div>{message}</div>
        </form>
    );
}
