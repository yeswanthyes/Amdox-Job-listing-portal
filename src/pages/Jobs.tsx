import { useState, useEffect } from 'react';
import { supabase, Job, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, Building2 } from 'lucide-react';

type JobWithEmployer = Job & {
  employer: Profile;
};

type JobsProps = {
  onApply: (job: Job) => void;
};

export function Jobs({ onApply }: JobsProps) {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobWithEmployer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobWithEmployer | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data as JobWithEmployer[]);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === '' || job.job_type === jobTypeFilter;
    const matchesLocation =
      locationFilter === '' || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Jobs</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No jobs found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 lg:max-h-[calc(100vh-20rem)] lg:overflow-y-auto">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                      {job.job_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{job.employer.company_name || job.employer.full_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {job.salary_min && job.salary_max
                          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                          : job.salary_min
                          ? `From $${job.salary_min.toLocaleString()}`
                          : `Up to $${job.salary_max?.toLocaleString()}`}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-4 lg:h-fit">
              {selectedJob ? (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">
                        {selectedJob.employer.company_name || selectedJob.employer.full_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full capitalize">
                      {selectedJob.job_type}
                    </span>
                    {(selectedJob.salary_min || selectedJob.salary_max) && (
                      <span className="text-sm text-gray-600 font-medium">
                        {selectedJob.salary_min && selectedJob.salary_max
                          ? `$${selectedJob.salary_min.toLocaleString()} - $${selectedJob.salary_max.toLocaleString()}`
                          : selectedJob.salary_min
                          ? `From $${selectedJob.salary_min.toLocaleString()}`
                          : `Up to $${selectedJob.salary_max?.toLocaleString()}`}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{selectedJob.description}</p>
                  </div>

                  {selectedJob.requirements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="text-gray-600">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {profile?.user_type === 'job_seeker' && (
                    <button
                      onClick={() => onApply(selectedJob)}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  )}

                  {!profile && (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">Sign in to apply for this job</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-md border text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
