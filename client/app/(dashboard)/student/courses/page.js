"use client";

import { BookOpen, Search, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../../lib/api";

export default function StudentCoursesPage() {
  const [allCourses, setAllCourses] = useState([]);
  const [enrollmentMap, setEnrollmentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get("/courses"),
          api.get("/enrollments/my-courses"),
        ]);

        // Build a map: courseId -> enrollment status
        const eMap = {};
        enrollmentsRes.data.forEach((e) => {
          eMap[e.courseId] = e.status; // "pending" | "approved" | "rejected"
        });
        setEnrollmentMap(eMap);

        setAllCourses(
          coursesRes.data.map((c) => ({
            id: c.courseId,
            title: c.title,
            instructor: c.facultyName || "Unknown Instructor",
            modules: c.modules ? c.modules.length : 0,
            duration: "Self-Paced",
            category: c.category || "General",
            description: c.description || "No description provided.",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await api.post("/enrollments/enroll", { courseId });
      setEnrollmentMap((prev) => ({ ...prev, [courseId]: "pending" }));
    } catch (err) {
      const msg = err.response?.data?.error || "Enrollment failed";
      console.error("Enrollment failed:", msg);
      alert(msg);
    } finally {
      setEnrolling(null);
    }
  };

  const getStatus = (courseId) => enrollmentMap[courseId] || "available";

  const filtered = allCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(c.id);
    if (tab === "all") return matchesSearch;
    if (tab === "enrolled") return matchesSearch && status === "approved";
    if (tab === "pending") return matchesSearch && status === "pending";
    if (tab === "available")
      return matchesSearch && (status === "available" || status === "rejected");
    return matchesSearch;
  });

  const tabs = [
    { key: "all", label: "All Courses" },
    { key: "enrolled", label: "Enrolled" },
    { key: "pending", label: "Pending" },
    { key: "available", label: "Available" },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          text: "Enrolled",
          classes: "bg-emerald-50 text-emerald-700",
        };
      case "pending":
        return {
          text: "Pending Approval",
          classes: "bg-amber-50 text-amber-700",
        };
      case "rejected":
        return {
          text: "Rejected",
          classes: "bg-red-50 text-red-600",
        };
      default:
        return {
          text: "Available",
          classes: "bg-slate-50 text-slate-600",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Courses</h2>
        <p className="text-slate-500 text-sm mt-1">
          Browse and request enrollment in courses.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or instructors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

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

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading courses...</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => {
              const status = getStatus(course.id);
              const badge = statusBadge(status);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div
                    className={`h-2 ${
                      status === "approved"
                        ? "bg-emerald-500"
                        : status === "pending"
                        ? "bg-amber-400"
                        : "bg-slate-300"
                    }`}
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {course.category}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.classes}`}
                      >
                        {badge.text}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {course.modules}{" "}
                        Modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                    </div>

                    {status === "approved" ? (
                      <div className="w-full py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium text-center">
                        ✓ Enrolled
                      </div>
                    ) : status === "pending" ? (
                      <div className="w-full py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium text-center">
                        ⏳ Awaiting Faculty Approval
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                        className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {enrolling === course.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}
                        Request Enrollment
                      </button>
                    )}

                    <p className="text-xs text-slate-500 mt-3">
                      By {course.instructor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No courses found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
