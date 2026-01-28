import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Briefcase, User } from 'lucide-react';

type ProfileSetupProps = {
  onComplete: () => void;
};

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user, refreshProfile } = useAuth();
  const [userType, setUserType] = useState<'job_seeker' | 'employer' | ''>('');
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    company_name: '',
    company_website: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      setError('Please select account type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profileData = {
        id: user!.id,
        user_type: userType,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        company_name: userType === 'employer' ? formData.company_name : null,
        company_website: userType === 'employer' ? formData.company_website : null,
        resume_url: null,
        skills: userType === 'job_seeker' && formData.skills
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (insertError) throw insertError;

      await refreshProfile();
      onComplete();
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-8">Tell us about yourself to get started</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('job_seeker')}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    userType === 'job_seeker'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className={`w-8 h-8 mb-3 ${userType === 'job_seeker' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="font-semibold text-gray-900">Job Seeker</div>
                  <div className="text-sm text-gray-600">Looking for opportunities</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('employer')}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    userType === 'employer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Briefcase className={`w-8 h-8 mb-3 ${userType === 'employer' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="font-semibold text-gray-900">Employer</div>
                  <div className="text-sm text-gray-600">Hiring talent</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            {userType === 'employer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            {userType === 'job_seeker' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js (comma separated)"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !userType}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Profile...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
