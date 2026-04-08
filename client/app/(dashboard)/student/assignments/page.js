"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Loader2,
} from "lucide-react";
import api from "../../../../lib/api";

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
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [submissionText, setSubmissionText] = useState({});
  const [submissionFile, setSubmissionFile] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/assignments/my-assignments");
        setAssignments(response.data);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleSubmit = async (assignmentId) => {
    const content = submissionText[assignmentId] || "";
    const file = submissionFile[assignmentId];
    
    if (!content.trim() && !file) {
      alert("Please provide some text or a file for your submission.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    setSubmitting(assignmentId);
    try {
      await api.post("/submissions/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update local state to reflect submission
      setAssignments((prev) =>
        prev.map((a) =>
          a.assignmentId === assignmentId
            ? { ...a, status: "submitted" }
            : a
        )
      );
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.response?.data?.error || "Submission failed");
    } finally {
      setSubmitting(null);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

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
          const isOpen = expandedId === a.assignmentId;
          return (
            <div
              key={a.assignmentId}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() =>
                  setExpandedId(isOpen ? null : a.assignmentId)
                }
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
                  <Clock className="w-3.5 h-3.5" />{" "}
                  {new Date(a.deadline).toLocaleDateString()}
                </span>
                {a.status === "graded" && (
                  <span className="text-sm font-semibold text-emerald-700 flex-shrink-0">
                    {a.grade}/{a.maxScore}
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
                  <div className="bg-white/50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Assignment Brief
                    </p>
                    <p className="text-sm text-slate-600">
                      {a.description || "No brief provided."}
                    </p>
                  </div>

                  {a.status === "pending" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-700">
                          Text Answer
                        </label>
                        <textarea
                          rows="3"
                          placeholder="Type your submission here..."
                          value={submissionText[a.assignmentId] || ""}
                          onChange={(e) =>
                            setSubmissionText((prev) => ({
                              ...prev,
                              [a.assignmentId]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-700">
                          Upload File (PDF or Image)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) =>
                              setSubmissionFile((prev) => ({
                                ...prev,
                                [a.assignmentId]: e.target.files[0],
                              }))
                            }
                            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSubmit(a.assignmentId)}
                        disabled={submitting === a.assignmentId}
                        className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 flex items-center gap-2"
                      >
                        {submitting === a.assignmentId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Submit Assignment
                      </button>
                    </div>
                  )}

                  {a.status === "submitted" && (
                    <div className="space-y-3">
                      <p className="text-sm text-blue-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Your submission is
                        under review.
                      </p>
                      {a.fileUrl && (
                        <div className="mt-2">
                          <a
                            href={`http://localhost:5001${a.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Your Submission
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {a.status === "graded" && (
                    <div className="space-y-4">
                      <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium inline-block">
                        Score: {a.grade} / {a.maxScore}
                      </div>
                      {a.fileUrl && (
                        <div>
                          <a
                            href={`http://localhost:5001${a.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Your Submission
                          </a>
                        </div>
                      )}
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
              {assignments.length === 0
                ? "Enrol in a course to see assignments here."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
