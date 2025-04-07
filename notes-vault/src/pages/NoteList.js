import { useEffect, useState } from 'react';
import api from '../api/config';
import { FiTrash2, FiFileText } from 'react-icons/fi';


const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Delete failed:', err.response?.data);
      setError('Failed to delete note. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notes-list">
      {notes.length === 0 ? (
        <div className="empty-state">
          <FiFileText className="empty-icon" />
          <p>No notes found. Upload your first note!</p>
        </div>
      ) : (
        notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-content">
              <h3 className="note-title">
                <FiFileText className="file-icon" />
                {note.filename}
              </h3>
              <p className="note-snippet">
                {note.content.substring(0, 150)}...
              </p>
              <div className="note-meta">
                <span className="note-date">
                  {new Date(note.upload_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(note.id)}
              aria-label="Delete note"
            >
              <FiTrash2 />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotesList;