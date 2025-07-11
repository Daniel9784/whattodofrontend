import React, { useState, useEffect } from 'react';
import api from '../api';

export default function SeeAllNotes() {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [filteredNotes, setFilteredNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
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

            const cats = Array.from(new Set(res.data.map(note => note.category))).filter(c => c);
            setCategories(cats);
        } catch (err) {
            console.error('Chyba pri načítaní poznámok:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const showCategoryColumn = selectedCategory === 'ALL';

    return (
        <div style={{ display: 'flex', maxWidth: 900, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Ľavý stĺpec - kategórie */}
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
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = selectedCategory !== 'ALL' ? '#f5f5f5' : '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedCategory === 'ALL' ? '#e0e0e0' : 'transparent'}
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
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = selectedCategory !== category ? '#f5f5f5' : '#e0e0e0'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedCategory === category ? '#e0e0e0' : 'transparent'}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Pravý stĺpec - poznámky v tabuľke */}
            <div style={{ width: '75%', padding: 10 }}>
                {filteredNotes.length === 0 ? (
                    <p>Žiadne poznámky v tejto kategórii.</p>
                ) : (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                        }}
                    >
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            {showCategoryColumn && (
                                <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Kategória</th>
                            )}
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Obsah</th>
                            <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Dátum</th>
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
                                <td
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: 8,
                                        maxWidth: 400,
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                    }}
                                >
                                    {note.content}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: 8, whiteSpace: 'normal' }}>
                                    {formatDate(note.createdAt)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
