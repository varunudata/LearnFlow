"use client";

import {
  BookOpen,
  ClipboardList,
  Award,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../lib/api";

export default function StudentDashboardPage() {
  const [userName, setUserName] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem("learnflow_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name || "Student");
    }

    const fetchData = async () => {
      try {
        const [coursesRes, assignmentsRes] = await Promise.all([
          api.get("/enrollments/my-courses"),
          api.get("/assignments/my-assignments"),
        ]);
        // Only show approved enrollments in the dashboard
        setEnrolledCourses(coursesRes.data.filter(e => e.status === "approved"));
        setAssignments(assignmentsRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const submittedCount = assignments.filter(
    (a) => a.status === "submitted"
  ).length;
  const gradedAssignments = assignments.filter((a) => a.status === "graded");
  const totalAssignments = assignments.length;
  const progressPct =
    totalAssignments > 0
      ? Math.round(
          ((submittedCount + gradedAssignments.length) / totalAssignments) * 100
        )
      : 0;

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length.toString(),
      change: "Currently active",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Assignments Due",
      value: pendingCount.toString(),
      change:
        pendingCount > 0
          ? `${pendingCount} pending`
          : "All caught up!",
      icon: ClipboardList,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Overall Progress",
      value: `${progressPct}%`,
      change: `${submittedCount + gradedAssignments.length}/${totalAssignments} completed`,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Graded",
      value: gradedAssignments.length.toString(),
      change:
        gradedAssignments.length > 0
          ? `Avg: ${Math.round(gradedAssignments.reduce((s, a) => s + (a.grade || 0), 0) / gradedAssignments.length)}%`
          : "No grades yet",
      icon: Award,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  const recentCourses = enrolledCourses.slice(0, 3);
  const upcomingAssignments = assignments
    .filter((a) => a.status === "pending")
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {userName.split(" ")[0]} 👋
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
              Enrolled Courses
            </h3>
            <Link
              href="/student/courses"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentCourses.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                You haven&apos;t enrolled in any courses yet.
              </div>
            ) : (
              recentCourses.map((enrollment) => (
                <div
                  key={enrollment.enrollmentId}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {enrollment.courseTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      Enrolled{" "}
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assignments — narrower */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">
              Upcoming Assignments
            </h3>
            <Link
              href="/student/assignments"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingAssignments.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                No pending assignments 🎉
              </div>
            ) : (
              upcomingAssignments.map((a) => (
                <div key={a.assignmentId} className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {a.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{a.course}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {new Date(a.deadline).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      Pending
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
