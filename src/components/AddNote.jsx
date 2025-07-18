import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AddNote() {
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [dueDateDate, setDueDateDate] = useState('');
    const [dueDateTime, setDueDateTime] = useState('');
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [catModalOpen, setCatModalOpen] = useState(false);
    const [newCat, setNewCat] = useState('');
    const [editCatIdx, setEditCatIdx] = useState(null);
    const [editCatValue, setEditCatValue] = useState('');

    // Fetch categories from backend
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/user/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post("/user/add-note", {
                category,
                content,
                dueDate: dueDateDate,
                dueTime: dueDateTime
            });
            setMessage("Poznámka bola úspešne pridaná.");
            setCategory('');
            setContent('');
            setDueDateDate('');
            setDueDateTime('');
        } catch (error) {
            setMessage(error.response?.data?.error || "Nepodarilo sa pridať poznámku.");
        }
    };

    // Category management handlers (all use backend)
    const handleAddCategory = async () => {
        if (newCat && !categories.includes(newCat)) {
            try {
                await api.post('/user/categories', { name: newCat });
                setNewCat('');
                fetchCategories();
            } catch (error) {
                console.error("Add category error:", error);
                alert('Nepodarilo sa pridať kategóriu.');
            }
        }
    };

    const handleDeleteCategory = async (idx) => {
        const catName = categories[idx];
        try {
            await api.delete(`/user/categories/${encodeURIComponent(catName)}`);
            if (category === catName) setCategory('');
            fetchCategories();
        } catch (error) {
            console.error("Delete category error:", error);
            alert('Nepodarilo sa zmazať kategóriu.');
        }
    };

    const handleEditCategory = (idx) => {
        setEditCatIdx(idx);
        setEditCatValue(categories[idx]);
    };

    const handleSaveEditCategory = async () => {
        const oldName = categories[editCatIdx];
        if (editCatValue && !categories.includes(editCatValue)) {
            try {
                await api.put(`/user/categories/${encodeURIComponent(oldName)}`, { name: editCatValue });
                if (category === oldName) setCategory(editCatValue);
                setEditCatIdx(null);
                setEditCatValue('');
                fetchCategories();
            } catch (error) {
                console.error("Rename category error:", error);
                alert('Nepodarilo sa premenovať kategóriu.');
            }
        }
    };

    return (
        <div>
            <h3 className="mb-4">Pridať poznámku</h3>
            <div className="row justify-content-center" style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                            <label className="form-label" style={{ marginRight: 8 }}>Kategória</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            >
                                <option value="" disabled hidden>-- Vyber kategóriu --</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                style={{ marginLeft: 8 }}
                                onClick={() => setCatModalOpen(true)}
                                title="Spravovať kategórie"
                            >⚙️</button>
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

                        <div className="mb-3">
                            <label className="form-label">Dátum splnenia</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dueDateDate}
                                onChange={(e) => setDueDateDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Čas splnenia</label>
                            <input
                                type="time"
                                className="form-control"
                                value={dueDateTime}
                                onChange={(e) => setDueDateTime(e.target.value)}
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
            {/* Category management modal */}
            {catModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff', padding: 24, borderRadius: 8, minWidth: 350, boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
                    }}>
                        <h4>Spravovať kategórie</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {categories.map((cat, idx) => (
                                <li key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    {editCatIdx === idx ? (
                                        <>
                                            <input
                                                value={editCatValue}
                                                onChange={e => setEditCatValue(e.target.value)}
                                                style={{ flex: 1, marginRight: 8 }}
                                            />
                                            <button className="btn btn-sm btn-success" onClick={handleSaveEditCategory}>Uložiť</button>
                                            <button className="btn btn-sm btn-secondary" onClick={() => setEditCatIdx(null)} style={{ marginLeft: 4 }}>Zrušiť</button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ flex: 1 }}>{cat}</span>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditCategory(idx)} style={{ marginLeft: 4 }}>Prejmenovať</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(idx)} style={{ marginLeft: 4 }}>Zmazať</button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: 'flex', marginTop: 12 }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nová kategória"
                                value={newCat}
                                onChange={e => setNewCat(e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <button className="btn btn-sm btn-success" onClick={handleAddCategory}>Pridať</button>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <button className="btn btn-secondary" onClick={() => setCatModalOpen(false)}>Zavrieť</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}