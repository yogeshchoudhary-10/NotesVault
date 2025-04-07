import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Notes Dashboard</h1>
      <div className="dashboard-grid">
        <Link 
          to="/notes" 
          className="dashboard-card"
        >
          <h2 className="card-title">View All Notes</h2>
          <p className="card-desc">Browse your saved notes</p>
        </Link>
        <Link 
          to="/upload" 
          className="dashboard-card"
        >
          <h2 className="card-title">Upload New</h2>
          <p className="card-desc">Add new files to your vault</p>
        </Link>
        <Link 
          to="/search" 
          className="dashboard-card"
        >
          <h2 className="card-title">Search Notes</h2>
          <p className="card-desc">Find content across your files</p>
        </Link>
      </div>
    </div>
  );
}