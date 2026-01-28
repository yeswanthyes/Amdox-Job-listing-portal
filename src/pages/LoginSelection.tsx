import { Briefcase, User, ArrowRight } from 'lucide-react';

type LoginSelectionProps = {
  onSelect: (type: 'job_seeker' | 'employer') => void;
};

export function LoginSelection({ onSelect }: LoginSelectionProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-5xl font-bold text-gradient mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-600">
            Are you looking for a job or hiring talent?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Job Seeker Card */}
          <div
            onClick={() => onSelect('job_seeker')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-slideInLeft border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <User className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Job Seeker
              </h3>

              <p className="text-gray-600 mb-6 text-base">
                Browse job openings, build your profile, and connect with employers
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Search and filter jobs</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Track applications</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Showcase your skills</span>
                </div>
              </div>

              <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>

          {/* Employer Card */}
          <div
            onClick={() => onSelect('employer')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-slideInRight border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Employer
              </h3>

              <p className="text-gray-600 mb-6 text-base">
                Post jobs, find talented candidates, and build your team
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>Post job openings</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>Manage applications</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span>Find top talent</span>
                </div>
              </div>

              <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm animate-fadeIn">
          <p>
            By continuing, you agree to our{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
