"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Clock,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import api from "../../../../../lib/api";

export default function FacultyCourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "" });
  const [error, setError] = useState("");

  // Submissions state: keyed by assignmentId
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [loadingSubs, setLoadingSubs] = useState(null);
  const [grading, setGrading] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assignmentsRes] = await Promise.all([
          api.get("/courses"),
          api.get(`/assignments/course/${courseId}`),
        ]);
        const myCourse = coursesRes.data.find(
          (c) => c.courseId === parseInt(courseId)
        );
        setCourse(myCourse || null);
        setAssignments(assignmentsRes.data);
      } catch (err) {
        console.error("Failed to load course data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      setError("Title and deadline are required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/assignments", {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        courseId: parseInt(courseId),
      });
      setAssignments((prev) => [res.data, ...prev]);
      setFormData({ title: "", description: "", deadline: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create assignment");
    } finally {
      setCreating(false);
    }
  };

  const toggleSubmissions = async (assignmentId) => {
    if (expandedAssignment === assignmentId) {
      setExpandedAssignment(null);
      return;
    }
    setExpandedAssignment(assignmentId);

    if (!submissions[assignmentId]) {
      setLoadingSubs(assignmentId);
      try {
        const res = await api.get(`/submissions/assignment/${assignmentId}`);
        setSubmissions((prev) => ({ ...prev, [assignmentId]: res.data }));
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoadingSubs(null);
      }
    }
  };

  const handleGrade = async (submissionId, assignmentId) => {
    const grade = parseInt(gradeInputs[submissionId]);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert("Enter a grade between 0 and 100");
      return;
    }
    setGrading(submissionId);
    try {
      await api.put(`/submissions/grade/${submissionId}`, { grade });
      // Update local state
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: prev[assignmentId].map((s) =>
          s.submissionId === submissionId ? { ...s, grade } : s
        ),
      }));
    } catch (err) {
      console.error("Grading failed:", err);
    } finally {
      setGrading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-24 text-slate-400">
        <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Course not found</p>
        <Link
          href="/faculty/courses"
          className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
        >
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/faculty/courses"
            className="mt-1 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {course.title}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {course.description || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              {course.category && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  {course.level}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Create Assignment Form */}
      {showForm && (
        <form
          onSubmit={handleCreateAssignment}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900">
            Create Assignment
          </h3>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. Data Visualization Project"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Brief students about the assignment..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) =>
                setFormData((p) => ({ ...p, deadline: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Assignment
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Assignments List */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          Assignments ({assignments.length})
        </h3>

        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No assignments yet</p>
            <p className="text-sm mt-1">
              Click &quot;New Assignment&quot; to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => {
              const isExpanded = expandedAssignment === a.assignmentId;
              const subs = submissions[a.assignmentId] || [];
              const isLoadingSubs = loadingSubs === a.assignmentId;

              return (
                <div
                  key={a.assignmentId}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Assignment row */}
                  <button
                    onClick={() => toggleSubmissions(a.assignmentId)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        Due:{" "}
                        {new Date(a.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Users className="w-4 h-4" />
                      View Submissions
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Submissions panel */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      <div className="px-5 py-4 bg-white/50 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Assignment Brief
                        </p>
                        <p className="text-sm text-slate-600">
                          {a.description || "No brief provided."}
                        </p>
                      </div>

                      {isLoadingSubs ? (
                        <div className="py-8 text-center text-slate-500">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Loading submissions...
                        </div>
                      ) : subs.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">
                          No submissions yet for this assignment.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {subs.map((sub) => (
                            <div
                              key={sub.submissionId}
                              className="px-5 py-4 flex items-start gap-4"
                            >
                              {/* Student info */}
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {sub.studentName
                                  ? sub.studentName
                                      .split(" ")
                                      .map((w) => w[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)
                                  : "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">
                                  {sub.studentName}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Submitted{" "}
                                  {new Date(
                                    sub.submittedAt
                                  ).toLocaleDateString()}
                                </p>
                                <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                                  {sub.content || "No text content provided."}
                                </div>

                                {sub.fileUrl && (
                                  <div className="mt-2">
                                    <a
                                      href={`http://localhost:5001${sub.fileUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      View Attached File
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Grade controls */}
                              <div className="flex-shrink-0 flex items-center gap-2">
                                {sub.grade !== null && sub.grade !== undefined ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4" />
                                      {sub.grade}/100
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="0-100"
                                      value={
                                        gradeInputs[sub.submissionId] || ""
                                      }
                                      onChange={(e) =>
                                        setGradeInputs((prev) => ({
                                          ...prev,
                                          [sub.submissionId]: e.target.value,
                                        }))
                                      }
                                      className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button
                                      onClick={() =>
                                        handleGrade(
                                          sub.submissionId,
                                          a.assignmentId
                                        )
                                      }
                                      disabled={grading === sub.submissionId}
                                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-70 flex items-center gap-1.5"
                                    >
                                      {grading === sub.submissionId ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : null}
                                      Grade
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
