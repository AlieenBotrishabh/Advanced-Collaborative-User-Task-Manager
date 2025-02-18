import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

function Note() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [projectId]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/projects/${projectId}/notes`);
            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            setNotes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addNote = async () => {
        if (!newNote.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/projects/${projectId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newNote,
                    createdAt: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Failed to add note');
            const addedNote = await response.json();
            setNotes(prevNotes => [...prevNotes, addedNote]);
            setNewNote('');
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:5000/projects/${projectId}/notes/${noteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete note');
            setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-400">Loading notes...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">Project Notes</h1>
                </div>

                {error && <div className="bg-red-500 text-white px-4 py-3 rounded-md mb-4">{error}</div>}

                <div className="mb-6">
                    <div className="flex gap-2">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a new note..."
                            className="flex-1 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            rows="3"
                        />
                        <button
                            onClick={addNote}
                            className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-start gap-4">
                                <p className="text-gray-300 flex-1">{note.content}</p>
                                <button
                                    onClick={() => deleteNote(note._id)}
                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                {new Date(note.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Note;