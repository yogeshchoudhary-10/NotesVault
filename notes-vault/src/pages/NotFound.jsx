import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">The page you're looking for doesn't exist</p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return Home
      </Link>
    </div>
  );
}