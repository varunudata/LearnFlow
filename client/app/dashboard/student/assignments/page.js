"use client";

import { useState } from "react";
import {
  ClipboardList,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Data Visualization Project",
    course: "Introduction to Data Science",
    due: "Apr 2, 2026",
    status: "pending",
    description:
      "Create an interactive dashboard using Python and Plotly to visualize a real-world dataset of your choice.",
    maxScore: 100,
    score: null,
  },
  {
    id: 2,
    title: "REST API Implementation",
    course: "Web Development Bootcamp",
    due: "Apr 5, 2026",
    status: "pending",
    description:
      "Build a RESTful API with Node.js and Express including CRUD operations and authentication middleware.",
    maxScore: 100,
    score: null,
  },
  {
    id: 3,
    title: "Linear Regression Report",
    course: "Machine Learning Fundamentals",
    due: "Apr 8, 2026",
    status: "submitted",
    description:
      "Write a report analysing a regression model you trained on the housing dataset. Include evaluation metrics.",
    maxScore: 100,
    score: null,
  },
  {
    id: 4,
    title: "SQL Query Optimisation",
    course: "Database Management Systems",
    due: "Mar 15, 2026",
    status: "graded",
    description:
      "Optimise a set of SQL queries for a large e-commerce database and document your approach.",
    maxScore: 100,
    score: 92,
  },
  {
    id: 5,
    title: "ER Diagram & Normalisation",
    course: "Database Management Systems",
    due: "Mar 1, 2026",
    status: "graded",
    description:
      "Design a normalised ER diagram for a university management system up to 3NF.",
    maxScore: 100,
    score: 88,
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700",
    icon: AlertCircle,
  },
  submitted: {
    label: "Submitted",
    classes: "bg-blue-50 text-blue-700",
    icon: Upload,
  },
  graded: {
    label: "Graded",
    classes: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
};

export default function StudentAssignmentsPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "submitted", label: "Submitted" },
    { key: "graded", label: "Graded" },
  ];

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.course.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (tab === "all" || a.status === tab);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
        <p className="text-slate-500 text-sm mt-1">
          View, submit, and track all your course assignments.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search assignments…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === t.key
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Assignment list */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const cfg = statusConfig[a.status];
          const isOpen = expandedId === a.id;
          return (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : a.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.course}</p>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0 hidden sm:flex">
                  <Clock className="w-3.5 h-3.5" /> {a.due}
                </span>
                {a.status === "graded" && (
                  <span className="text-sm font-semibold text-emerald-700 flex-shrink-0">
                    {a.score}/{a.maxScore}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ${cfg.classes}`}
                >
                  <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 py-4 space-y-4 bg-slate-50/50">
                  <p className="text-sm text-slate-600">{a.description}</p>

                  {a.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 bg-white text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer">
                        <Upload className="w-5 h-5" />
                        <span>Click to upload your submission</span>
                        <input type="file" className="hidden" />
                      </label>
                      <button className="px-5 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
                        Submit
                      </button>
                    </div>
                  )}

                  {a.status === "submitted" && (
                    <p className="text-sm text-blue-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Your submission is
                      under review.
                    </p>
                  )}

                  {a.status === "graded" && (
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                        Score: {a.score} / {a.maxScore}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No assignments found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
