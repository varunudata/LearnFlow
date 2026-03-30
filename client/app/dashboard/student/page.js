import {
  BookOpen,
  ClipboardList,
  Award,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Enrolled Courses",
    value: "6",
    change: "+2 this month",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Assignments Due",
    value: "3",
    change: "Next due in 2 days",
    icon: ClipboardList,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Overall Progress",
    value: "68%",
    change: "+12% this week",
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Certificates Earned",
    value: "2",
    change: "1 pending",
    icon: Award,
    color: "text-indigo-600 bg-indigo-50",
  },
];

const recentCourses = [
  {
    title: "Introduction to Data Science",
    instructor: "Dr. Sarah Wilson",
    progress: 85,
    modules: "12 Modules",
  },
  {
    title: "Web Development Bootcamp",
    instructor: "Prof. Mike Chen",
    progress: 62,
    modules: "18 Modules",
  },
  {
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Amy Park",
    progress: 34,
    modules: "15 Modules",
  },
];

const upcomingAssignments = [
  {
    title: "Data Visualization Project",
    course: "Introduction to Data Science",
    due: "Apr 2, 2026",
    status: "pending",
  },
  {
    title: "REST API Implementation",
    course: "Web Development Bootcamp",
    due: "Apr 5, 2026",
    status: "pending",
  },
  {
    title: "Linear Regression Report",
    course: "Machine Learning Fundamentals",
    due: "Apr 8, 2026",
    status: "submitted",
  },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, John 👋
        </h2>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of your learning activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Courses — wider */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Courses
            </h3>
            <Link
              href="/dashboard/student/courses"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentCourses.map((course) => (
              <div
                key={course.title}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {course.instructor} · {course.modules}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-9 text-right">
                    {course.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments — narrower */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">
              Upcoming Assignments
            </h3>
            <Link
              href="/dashboard/student/assignments"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingAssignments.map((a) => (
              <div key={a.title} className="px-6 py-4">
                <p className="text-sm font-medium text-slate-900">{a.title}</p>
                <p className="text-xs text-slate-500 mt-1">{a.course}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {a.due}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      a.status === "submitted"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {a.status === "submitted" ? "Submitted" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
