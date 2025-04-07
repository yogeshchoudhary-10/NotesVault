import { useState } from 'react';
import api from '../api/config';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';


const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setUploadStatus('success');
      onUploadSuccess(response.data);
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setUploadStatus(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setUploadStatus(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setUploadStatus(null);
    setError('');
  };

  return (
    <div className="file-upload-container">
      <div className={`upload-area ${isLoading ? 'uploading' : ''}`}>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={isLoading}
        />
        <label htmlFor="file-input">
          <div className="upload-content">
            <FiUploadCloud className="upload-icon" />
            <p>Drag & drop files or click to upload</p>
            <p className="supported-files">Supported formats: PDF, PNG, JPG</p>
          </div>
        </label>
      </div>

      {file && (
        <div className="file-preview">
          <div className="file-info">
            <FiFile className="file-icon" />
            <div>
              <p className="file-name">{file.name}</p>
              <p className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button className="remove-file" onClick={removeFile}>
              <FiX />
            </button>
          </div>

          {isLoading && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="progress-text">{progress}%</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="upload-success">Upload successful!</div>
          )}

          {uploadStatus === 'error' && (
            <div className="upload-error">{error}</div>
          )}
        </div>
      )}

      {file && !isLoading && !uploadStatus && (
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={isLoading}
        >
          Upload File
        </button>
      )}
    </div>
  );
};

export default FileUpload;