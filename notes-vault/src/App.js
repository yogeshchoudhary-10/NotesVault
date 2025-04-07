import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';
import './App.css';  // Make sure this import is present
// Lazy load main pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotesList = lazy(() => import('./pages/NoteList'));
const FileUpload = lazy(() => import('./pages/FileUpload'));
const SearchResults = lazy(() => import('./pages/SearchBar'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />

            {/* Private Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/notes" element={
                <PrivateRoute>d
                  <NotesList />
                </PrivateRoute>
              } />
              <Route path="/upload" element={
                <PrivateRoute>
                  <FileUpload />
                </PrivateRoute>
              } />
              <Route path="/search" element={
                <PrivateRoute>
                  <SearchResults />
                </PrivateRoute>
              } />
              <Route path="/notes/:id" element={
                <PrivateRoute>
                  <NoteDetail />
                </PrivateRoute>
              } />
            </Route>

            {/* Error Routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;