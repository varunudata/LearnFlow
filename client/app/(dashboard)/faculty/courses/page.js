"use client";

import { BookOpen, Search, Users, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../../lib/api";

export default function FacultyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userStr = localStorage.getItem("learnflow_user");
        let myFacultyId = null;
        if (userStr) {
          myFacultyId = JSON.parse(userStr).userId;
        }

        const response = await api.get("/courses");
        // Filter out courses that don't belong to this faculty
        const myCourses = myFacultyId 
            ? response.data.filter(c => c.facultyId === myFacultyId) 
            : response.data;
            
        setCourses(
          myCourses.map((c) => ({
            id: c.courseId,
            title: c.title,
            students: 0,
            modules: c.modules ? c.modules.length : 0,
            status: "published",
            revenue: "$0 (Free)",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch faculty courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Courses</h2>
          <p className="text-slate-500 text-sm mt-1">
            Create, edit, and oversee the courses you offer.
          </p>
        </div>
        <Link
          href="/faculty/courses/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search your courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Course List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                   <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
                   Loading your courses...
                </td>
              </tr>
            ) : filtered.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/faculty/courses/${course.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</p>
                      <p className="text-xs text-slate-500">{course.modules} Modules</p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4 text-slate-400" />
                    {course.students}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      course.status === "published"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/faculty/courses/${course.id}`}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-2 inline-block"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
