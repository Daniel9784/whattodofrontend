import React, { useState } from 'react';
import api from '../api';

export default function AddNote() {
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post("/notes", { category, content });
            setMessage("Poznámka bola úspešne pridaná.");
            setCategory('');
            setContent('');
        } catch (error) {
            console.error("Add note error:", error);
            setMessage(error.response?.data?.error || "Nepodarilo sa pridať poznámku.");
        }
    };

    return (
        <div>
            <h3 className="mb-4">Pridať poznámku</h3>
            <div className="row justify-content-center" style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Kategória</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden>-- Vyber kategóriu --</option>
                                <option value="osobné">Osobné</option>
                                <option value="práca">Práca</option>
                                <option value="iné">Iné</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Obsah poznámky</label>
                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Napíš svoju poznámku sem..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success">Uložiť poznámku</button>
                    </form>

                    {message && (
                        <div className="alert alert-info mt-3">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
