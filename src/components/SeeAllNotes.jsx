import React, { useState, useEffect } from 'react';
import api from '../api';

export default function SeeAllNotes() {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        content: '',
        category: '',
        dueDate: '',
        dueTime: ''
    });

    useEffect(() => {
        fetchNotes();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'ALL') {
            setFilteredNotes(notes);
        } else {
            setFilteredNotes(notes.filter(note => note.category === selectedCategory));
        }
    }, [notes, selectedCategory]);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/user/show-notes');
            setNotes(res.data);
        } catch (err) {
            console.error('Chyba pri načítaní poznámok:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/user/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Chyba pri načítaní kategórií:', err);
        }
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setForm({
            content: note.content || '',
            category: note.category || '',
            dueDate: note.dueDate || '',
            dueTime: note.dueTime || ''
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingNote(null);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/user/edit-note/${editingNote.id}`, form);
            setNotes(notes.map(note =>
                note.id === editingNote.id ? { ...note, ...form } : note
            ));
            closeModal();
        } catch (error) {
            console.error("Failed to edit note", error);
            alert('Zlyhala zmena poznamky.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(`/user/delete-note/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error("Failed to delete note", error);
            alert("Zlyhalo zmazanie poznamky.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const showCategoryColumn = selectedCategory === 'ALL';

    return (
        <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                width: '25%',
                borderRight: '1px solid #ccc',
                padding: 10,
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 8,
                marginRight: 15,
                height: 'fit-content',
            }}>
                <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: 8, marginBottom: 12 }}>Kategórie</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    <li
                        style={{
                            cursor: 'pointer',
                            fontWeight: selectedCategory === 'ALL' ? 'bold' : 'normal',
                            padding: '8px 12px',
                            borderRadius: 4,
                            backgroundColor: selectedCategory === 'ALL' ? '#e0e0e0' : 'transparent',
                            marginBottom: 6,
                            userSelect: 'none',
                            transition: 'background-color 0.2s',
                        }}
                        onClick={() => setSelectedCategory('ALL')}
                    >
                        ALL
                    </li>
                    {categories.map(category => (
                        <li
                            key={category}
                            style={{
                                cursor: 'pointer',
                                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                                padding: '8px 12px',
                                borderRadius: 4,
                                backgroundColor: selectedCategory === category ? '#e0e0e0' : 'transparent',
                                marginBottom: 6,
                                userSelect: 'none',
                                transition: 'background-color 0.2s',
                            }}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ width: '75%', padding: 10 }}>
                {filteredNotes.length === 0 ? (
                    <p>Žiadne poznámky v tejto kategórii.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            {showCategoryColumn && (
                                <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'center' }}>Kategória</th>
                            )}
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'center' }}>Obsah</th>
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'center' }}>Dátum pridania</th>
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'center' }}>Dátum splnenia</th>
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'center', width: 180 }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredNotes.map(note => (
                            <tr key={note.id}>
                                {showCategoryColumn && (
                                    <td style={{ border: '1px solid #ddd', padding: 8, whiteSpace: 'normal' }}>
                                        {note.category || 'Bez kategórie'}
                                    </td>
                                )}
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: 8,
                                    maxWidth: 400,
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                }}>
                                    {note.content}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: 8, whiteSpace: 'normal' }}>
                                    {formatDate(note.createdAt)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: 8, whiteSpace: 'normal' }}>
                                    {note.dueDate
                                        ? formatDate(note.dueTime ? `${note.dueDate}T${note.dueTime}` : note.dueDate)
                                        : '—'}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                                    <button
                                        style={{ marginRight: 8 }}
                                        className="btn btn-sm btn-primary"
                                        onClick={() => openEditModal(note)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
                    }}>
                        <h3>Edit Note</h3>
                        <form onSubmit={handleEdit}>
                            <div style={{ marginBottom: 12 }}>
                                <label>Content:</label>
                                <input
                                    type="text"
                                    name="content"
                                    value={form.content}
                                    onChange={handleFormChange}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label>Category:</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleFormChange}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">-- Vyber kategóriu --</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label>Due Date:</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleFormChange}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label>Due Time:</label>
                                <input
                                    type="time"
                                    name="dueTime"
                                    value={form.dueTime}
                                    onChange={handleFormChange}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeModal} style={{ marginRight: 8 }}>Cancel</button>
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}