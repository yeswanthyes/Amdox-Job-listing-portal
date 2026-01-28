import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { LoginSelection } from './pages/LoginSelection';
import { ProfileSetup } from './pages/ProfileSetup';
import { Profile } from './pages/Profile';
import { Jobs } from './pages/Jobs';
import { Dashboard } from './pages/Dashboard';
import { ApplyJobModal } from './components/ApplyJobModal';
import { Job } from './lib/supabase';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedUserType, setSelectedUserType] = useState<'job_seeker' | 'employer' | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && !profile && currentView !== 'profile-setup') {
    return (
      <div className="min-h-screen bg-white">
        <ProfileSetup onComplete={() => setCurrentView('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} onNavigate={(view) => {
        setCurrentView(view);
        setSelectedUserType(null);
      }} />

      {currentView === 'home' && <Home onNavigate={setCurrentView} />}
      {currentView === 'login' && !user && !selectedUserType && <LoginSelection onSelect={(type) => {
        setSelectedUserType(type);
      }} />}
      {currentView === 'login' && !user && selectedUserType && <Login userType={selectedUserType} onBack={() => setSelectedUserType(null)} />}
      {currentView === 'profile' && user && profile && <Profile />}
      {currentView === 'jobs' && <Jobs onApply={(job) => setApplyingJob(job)} />}
      {currentView === 'dashboard' && user && profile && <Dashboard />}

      {applyingJob && user && profile?.user_type === 'job_seeker' && (
        <ApplyJobModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
