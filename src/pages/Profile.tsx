import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Edit2, Save, X } from 'lucide-react';

export function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    company_name: '',
    company_website: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        company_name: profile.company_name || '',
        company_website: profile.company_website || '',
        skills: profile.skills?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updateData: any = {
        full_name: formData.full_name,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
      };

      if (profile?.user_type === 'employer') {
        updateData.company_name = formData.company_name;
        updateData.company_website = formData.company_website || null;
      } else if (profile?.user_type === 'job_seeker') {
        updateData.skills = formData.skills
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile!.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
                <p className="text-blue-100 capitalize">{profile.user_type.replace('_', ' ')}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {message && (
            <div className={`mx-8 mt-6 p-4 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {profile.user_type === 'employer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
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
                      />
                    </div>
                  </>
                )}

                {profile.user_type === 'job_seeker' && (
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

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                {profile.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                )}

                {profile.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                )}

                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}

                {profile.user_type === 'employer' && profile.company_name && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
                      <p className="text-gray-900">{profile.company_name}</p>
                    </div>
                    {profile.company_website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                        <a
                          href={profile.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.company_website}
                        </a>
                      </div>
                    )}
                  </>
                )}

                {profile.user_type === 'job_seeker' && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
