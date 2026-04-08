"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  UserCheck,
  BookOpen,
} from "lucide-react";
import api from "../../../../lib/api";

export default function FacultyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/enrollments/pending");
      setEnrollments(res.data);
    } catch (err) {
      console.error("Failed to fetch pending enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    setProcessing(enrollmentId);
    try {
      await api.put(`/enrollments/approve/${enrollmentId}`);
      setEnrollments((prev) =>
        prev.filter((e) => e.enrollmentId !== enrollmentId)
      );
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (enrollmentId) => {
    setProcessing(enrollmentId);
    try {
      await api.put(`/enrollments/reject/${enrollmentId}`);
      setEnrollments((prev) =>
        prev.filter((e) => e.enrollmentId !== enrollmentId)
      );
    } catch (err) {
      console.error("Rejection failed:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Enrollment Requests
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Review and approve student enrollment requests for your courses.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <UserCheck className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No pending requests</p>
          <p className="text-sm mt-1">
            All enrollment requests have been processed.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {enrollments.map((e) => (
                <tr
                  key={e.enrollmentId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {e.studentName
                          ? e.studentName
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {e.studentName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {e.studentEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      {e.courseTitle}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(e.enrollmentId)}
                        disabled={processing === e.enrollmentId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {processing === e.enrollmentId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(e.enrollmentId)}
                        disabled={processing === e.enrollmentId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
