"use client";

import { useState } from "react";
import { Search, FileText, CheckCircle2 } from "lucide-react";

export default function FacultyAssignmentsPage() {
  const [search, setSearch] = useState("");

  const submissions = [
    {
      id: 1,
      student: "John Doe",
      assignment: "Data Visualization Project",
      course: "Introduction to Data Science",
      submittedAt: "Apr 1, 2026",
      status: "pending", // pending grading
    },
    {
      id: 2,
      student: "Alice Smith",
      assignment: "REST API Implementation",
      course: "Web Development Bootcamp",
      submittedAt: "Mar 30, 2026",
      status: "pending",
    },
    {
      id: 3,
      student: "Rob Williams",
      assignment: "Linear Regression Report",
      course: "Machine Learning Fundamentals",
      submittedAt: "Mar 28, 2026",
      status: "graded",
      score: 95,
      maxScore: 100,
    },
    {
      id: 4,
      student: "Emily Clark",
      assignment: "REST API Implementation",
      course: "Web Development Bootcamp",
      submittedAt: "Mar 30, 2026",
      status: "graded",
      score: 88,
      maxScore: 100,
    },
  ];

  const filtered = submissions.filter(
    (s) =>
      s.student.toLowerCase().includes(search.toLowerCase()) ||
      s.assignment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Grading</h2>
        <p className="text-slate-500 text-sm mt-1">
          Review student submissions and assign grades.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student or assignment…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* List */}
      <div className="grid lg:grid-cols-2 gap-5">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row"
          >
            <div className="p-5 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100 flex gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  sub.status === "graded"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {sub.assignment}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{sub.course}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden">
                    {sub.student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span>{sub.student}</span>
                  <span>•</span>
                  <span>Submitted {sub.submittedAt}</span>
                </div>
              </div>
            </div>

            {/* Grading Action Area */}
            <div className="p-5 bg-slate-50/50 flex flex-col justify-center min-w-[140px]">
              {sub.status === "pending" ? (
                <div className="space-y-3">
                  <span className="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Needs Grading
                  </span>
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
                    Review
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <span className="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 gap-1 items-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Graded
                  </span>
                  <p className="text-2xl font-bold text-slate-900">
                    {sub.score}
                    <span className="text-sm text-slate-400">
                      /{sub.maxScore}
                    </span>
                  </p>
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    Edit Grade
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-40 text-emerald-500" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm mt-1">
              No submissions match your current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
