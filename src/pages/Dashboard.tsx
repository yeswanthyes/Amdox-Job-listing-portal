import { useState, useEffect } from 'react';
import { supabase, Job, Application, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CreateJobModal } from '../components/CreateJobModal';
import { Plus, Edit2, Trash2, Eye, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';

type JobWithApplications = Job & {
  applications: (Application & {
    applicant: Profile;
  })[];
};

type ApplicationWithJob = Application & {
  job: Job & {
    employer: Profile;
  };
};

export function Dashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [selectedApplication, setSelectedApplication] = useState<Application & { applicant: Profile } | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.user_type === 'employer') {
        fetchEmployerJobs();
      } else {
        fetchJobSeekerApplications();
      }
    }
  }, [profile]);

  const fetchEmployerJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications (
            *,
            applicant:profiles(*)
          )
        `)
        .eq('employer_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data as JobWithApplications[]);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekerApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (
            *,
            employer:profiles(*)
          )
        `)
        .eq('applicant_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as ApplicationWithJob[]);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;
      fetchEmployerJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !job.is_active })
        .eq('id', job.id);

      if (error) throw error;
      fetchEmployerJobs();
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      fetchEmployerJobs();
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <Eye className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (profile?.user_type === 'employer') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
            </div>
            <button
              onClick={() => {
                setEditingJob(undefined);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Jobs</h3>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Jobs</h3>
              <p className="text-3xl font-bold text-green-600">
                {jobs.filter((j) => j.is_active).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
              <p className="text-3xl font-bold text-blue-600">
                {jobs.reduce((acc, job) => acc + job.applications.length, 0)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No job postings yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            job.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                          {job.job_type}
                        </span>
                      </div>
                      <p className="text-gray-600">{job.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setShowCreateModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {job.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Applications ({job.applications.length})
                    </h4>
                    {job.applications.length === 0 ? (
                      <p className="text-sm text-gray-500">No applications yet</p>
                    ) : (
                      <div className="space-y-2">
                        {job.applications.map((app) => (
                          <div
                            key={app.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{app.applicant.full_name}</p>
                              <p className="text-sm text-gray-600">{app.applicant.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                  app.status
                                )}`}
                              >
                                {getStatusIcon(app.status)}
                                {app.status}
                              </span>
                              <button
                                onClick={() => setSelectedApplication(app)}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showCreateModal && (
          <CreateJobModal
            onClose={() => {
              setShowCreateModal(false);
              setEditingJob(undefined);
            }}
            onSuccess={fetchEmployerJobs}
            editJob={editingJob}
          />
        )}

        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Applicant</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedApplication.applicant.full_name}
                  </p>
                  <p className="text-gray-600">{selectedApplication.applicant.email}</p>
                  {selectedApplication.applicant.phone && (
                    <p className="text-gray-600">{selectedApplication.applicant.phone}</p>
                  )}
                  {selectedApplication.applicant.location && (
                    <p className="text-gray-600">{selectedApplication.applicant.location}</p>
                  )}
                </div>

                {selectedApplication.applicant.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-gray-900">{selectedApplication.applicant.bio}</p>
                  </div>
                )}

                {selectedApplication.applicant.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.applicant.skills.map((skill, index) => (
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

                {selectedApplication.cover_letter && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h3>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'reviewed')}
                      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg"
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'accepted')}
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'rejected')}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your job applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {applications.filter((a) => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Reviewed</h3>
            <p className="text-3xl font-bold text-blue-600">
              {applications.filter((a) => a.status === 'reviewed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Accepted</h3>
            <p className="text-3xl font-bold text-green-600">
              {applications.filter((a) => a.status === 'accepted').length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No applications yet</p>
              <p className="text-sm text-gray-500">Start browsing jobs and apply to opportunities</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{app.job.title}</h3>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      {app.job.employer.company_name || app.job.employer.full_name}
                    </p>
                    <p className="text-gray-600">{app.job.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>

                {app.cover_letter && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Cover Letter</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{app.cover_letter}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
