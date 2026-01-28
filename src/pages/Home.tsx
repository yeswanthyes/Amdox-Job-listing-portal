import { Briefcase, Search, Users, TrendingUp, Zap, Shield, BarChart3, Sparkles } from 'lucide-react';

type HomeProps = {
  onNavigate: (view: string) => void;
};

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-flex items-center gap-2 bg-blue-400 bg-opacity-30 px-4 py-2 rounded-full mb-6 border border-blue-300 border-opacity-50">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">The Future of Hiring</span>
              </div>

              <h1 className="text-6xl font-bold leading-tight mb-6">
                Connect With Your Next <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Opportunity</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Discover thousands of jobs from leading companies or find your next great hire. Build your career or your team with JobConnect.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate('jobs')}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Browse Jobs
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8 text-sm">
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-blue-100">Active Jobs</p>
                </div>
                <div className="w-px h-12 bg-blue-300 opacity-50"></div>
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-blue-100">Companies</p>
                </div>
                <div className="w-px h-12 bg-blue-300 opacity-50"></div>
                <div>
                  <p className="text-3xl font-bold">100K+</p>
                  <p className="text-blue-100">Members</p>
                </div>
              </div>
            </div>

            <div className="relative animate-slideInRight hidden md:block">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Briefcase className="w-24 h-24 text-white opacity-80 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">Find Your Dream Job Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why JobConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the platform built for modern job seekers and employers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: 'Advanced Search',
                desc: 'Filter jobs by type, location, and keywords instantly',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Briefcase,
                title: 'Easy Posting',
                desc: 'Post and manage jobs effortlessly from your dashboard',
                color: 'from-indigo-500 to-indigo-600',
              },
              {
                icon: Users,
                title: 'Direct Connect',
                desc: 'Apply directly with your profile and cover letter',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: TrendingUp,
                title: 'Track Progress',
                desc: 'Monitor applications with real-time updates',
                color: 'from-pink-500 to-pink-600',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeIn">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Jobs</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Members</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of professionals and companies already using JobConnect
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Start Now - It's Free
          </button>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
