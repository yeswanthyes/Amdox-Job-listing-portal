import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type NavbarProps = {
  currentView: string;
  onNavigate: (view: string) => void;
};

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
            onNavigate('home');
            setIsOpen(false);
          }}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">JobConnect</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user && profile ? (
              <>
                <button
                  onClick={() => onNavigate('jobs')}
                  className={`text-sm font-medium smooth-transition ${
                    currentView === 'jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-medium smooth-transition ${
                    currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 text-sm font-medium smooth-transition ${
                    currentView === 'profile' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {profile.full_name.split(' ')[0]}
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 smooth-transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('jobs')}
                  className={`text-sm font-medium smooth-transition ${
                    currentView === 'jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Browse Jobs
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="btn-primary text-sm py-2"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {user && profile ? (
                <>
                  <button
                    onClick={() => { onNavigate('jobs'); setIsOpen(false); }}
                    className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
                    className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { onNavigate('profile'); setIsOpen(false); }}
                    className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onNavigate('jobs'); setIsOpen(false); }}
                    className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Browse Jobs
                  </button>
                  <button
                    onClick={() => { onNavigate('login'); setIsOpen(false); }}
                    className="btn-primary text-sm w-full"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
