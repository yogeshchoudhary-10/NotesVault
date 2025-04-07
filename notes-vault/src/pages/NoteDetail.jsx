import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/config';

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{note.filename}</h1>
        <Link 
          to="/notes" 
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to Notes
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4 text-gray-500">
          Uploaded on: {new Date(note.upload_date).toLocaleDateString()}
        </div>
        <div className="whitespace-pre-wrap">
          {note.content}
        </div>
      </div>
    </div>
  );
}