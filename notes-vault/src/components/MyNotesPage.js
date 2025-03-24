import React, { useState } from 'react';

function MyNotesPage({ onBack }) {
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !noteTitle || !noteSubject) {
      alert("Please fill all fields and select a PDF file");
      return;
    }

    // In a real app, you would upload the file to a server here
    // For now, we'll just simulate adding it to our list
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      subject: noteSubject,
      fileName: selectedFile.name,
      dateUploaded: new Date().toLocaleDateString(),
    };

    setUploadedNotes([...uploadedNotes, newNote]);
    setNoteTitle('');
    setNoteSubject('');
    setSelectedFile(null);
    
    // Reset the file input
    document.getElementById('file-upload').value = '';
  };

  return (
    <div className="notes-page">
      <nav className="navbar">
        <div className="nav-brand">Notes Vault</div>
        <div className="nav-links">
          <a href="#" className="nav-link" onClick={onBack}>Back to Search</a>
        </div>
      </nav>
      
      <div className="notes-content">
        <h2>My Notes</h2>
        
        <div className="upload-section">
          <h3>Upload New Notes</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label htmlFor="note-title">Note Title</label>
              <input
                type="text"
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="E.g., Calculus Lecture 3"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="note-subject">Subject</label>
              <input
                type="text"
                id="note-subject"
                value={noteSubject}
                onChange={(e) => setNoteSubject(e.target.value)}
                placeholder="E.g., Mathematics"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="file-upload">Upload PDF (Handwritten Notes)</label>
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              <p className="file-hint">Only PDF files are accepted</p>
            </div>
            
            <button type="submit" className="upload-button">Upload Notes</button>
          </form>
        </div>
        
        <div className="notes-list-section">
          <h3>Your Uploaded Notes</h3>
          {uploadedNotes.length > 0 ? (
            <ul className="notes-list">
              {uploadedNotes.map((note) => (
                <li key={note.id} className="note-item">
                  <div className="note-info">
                    <h4>{note.title}</h4>
                    <p><strong>Subject:</strong> {note.subject}</p>
                    <p><strong>File:</strong> {note.fileName}</p>
                    <p><strong>Uploaded:</strong> {note.dateUploaded}</p>
                  </div>
                  <div className="note-actions">
                    <button className="action-button">View</button>
                    <button className="action-button">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-notes-message">You haven't uploaded any notes yet. Use the form above to upload your first note.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyNotesPage;