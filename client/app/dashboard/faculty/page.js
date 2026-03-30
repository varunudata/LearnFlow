import {
  Users,
  ClipboardCheck,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Students",
    value: "245",
    change: "+15 this month",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Pending Submissions",
    value: "14",
    change: "Requires grading",
    icon: ClipboardCheck,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Active Courses",
    value: "3",
    change: "Current semester",
    icon: BookOpen,
    color: "text-emerald-600 bg-emerald-50",
  },
];

const pendingGrading = [
  {
    student: "John Doe",
    assignment: "Data Visualization Project",
    course: "Introduction to Data Science",
    submitted: "2 hours ago",
  },
  {
    student: "Alice Smith",
    assignment: "Data Visualization Project",
    course: "Introduction to Data Science",
    submitted: "Yesterday",
  },
  {
    student: "Rob Williams",
    assignment: "Hypothesis Testing",
    course: "Statistics for Analytics",
    submitted: "2 days ago",
  },
];

export default function FacultyDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, Dr. Wilson 👋
        </h2>
        <p className="text-slate-500 mt-1">
          Here is an overview of your instructor activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

      {/* Pending Tasks */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">
            Pending Grading
          </h3>
          <Link
            href="/dashboard/faculty/assignments"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingGrading.map((task, i) => (
            <div key={i} className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {task.student} — {task.assignment}
                </p>
                <p className="text-xs text-slate-500 mt-1">{task.course}</p>
                <p className="text-xs text-slate-400 mt-1">Submitted: {task.submitted}</p>
              </div>
              <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer">
                Grade
              </button>
            </div>
          ))}
          {pendingGrading.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <ClipboardCheck className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No assignments await grading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
