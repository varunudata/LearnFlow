import { BookOpen, CheckCircle, Award, Layout, Users, BarChart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl leading-none">
              L
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-900">
              Learnflow
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#platform" className="hover:text-indigo-600 transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
            Seamless Digital Education
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Everything you need <br />
            <span className="text-indigo-600">to teach and learn.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A unified platform for managing structured learning content, student enrollments, progress tracking, assignments, and certifications all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              Start Building Now
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-slate-700 font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <p className="text-3xl font-bold text-slate-900">10k+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">500+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Courses Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">99.9%</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">4.9/5</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Average Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Powerful tools for modern education
            </h2>
            <p className="text-lg text-slate-600">
              Stop juggling multiple tools. Learnflow brings all your educational processes together in one intuitive, unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Course Creation</h3>
              <p className="text-slate-600 leading-relaxed">
                Empower instructors to easily build and manage comprehensive courses with rich media support, structured curriculums, and dynamic content.
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Student Enrollment</h3>
              <p className="text-slate-600 leading-relaxed">
                Streamline the onboarding process. Handle registrations, manage student cohorts, and control access to specific courses effortlessly.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Module-based Learning</h3>
              <p className="text-slate-600 leading-relaxed">
                Organize content into logical, structured learning paths. Guide students step-by-step through materials for better retention and mastery.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Assignment Submissions</h3>
              <p className="text-slate-600 leading-relaxed">
                Collect, review, and grade student assignments directly within the platform. Provide clear feedback and manage deadlines easily.
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Monitor student performance in real-time. Detailed analytics help identify struggling students and measure overall course success.
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Certificate Generation</h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically generate and distribute beautiful, verifiable certificates upon course completion to reward student achievements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to transform your educational platform?</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of educators leveraging Learnflow to deliver exceptional digital learning experiences.
          </p>
          <Link href="/signup" className="inline-flex px-8 py-4 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 text-lg">
            Get Started For Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm leading-none">
              L
            </div>
            <span className="font-semibold text-lg text-slate-900">Learnflow</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Learnflow. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
