import { useState } from "react";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                setMessage("Login successful!");
            } else {
                setMessage(data.error || "Login failed");
            }
        } catch (error) {
            console.error(error)
            setMessage("Network error");
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
