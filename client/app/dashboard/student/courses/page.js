"use client";

import { BookOpen, Search, Users, Clock } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "Introduction to Data Science",
    instructor: "Dr. Sarah Wilson",
    students: 245,
    modules: 12,
    duration: "8 weeks",
    progress: 85,
    status: "enrolled",
    category: "Data Science",
    description:
      "Explore the fundamentals of data science including data wrangling, visualization, and statistical analysis.",
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    instructor: "Prof. Mike Chen",
    students: 312,
    modules: 18,
    duration: "12 weeks",
    progress: 62,
    status: "enrolled",
    category: "Development",
    description:
      "A comprehensive bootcamp covering HTML, CSS, JavaScript, React, and Node.js for full-stack development.",
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Amy Park",
    students: 198,
    modules: 15,
    duration: "10 weeks",
    progress: 34,
    status: "enrolled",
    category: "AI / ML",
    description:
      "Understand key algorithms behind supervised and unsupervised machine learning techniques.",
  },
  {
    id: 4,
    title: "Cloud Computing with AWS",
    instructor: "James Rodriguez",
    students: 156,
    modules: 10,
    duration: "6 weeks",
    progress: 0,
    status: "available",
    category: "Cloud",
    description:
      "Deploy and manage scalable cloud infrastructure using Amazon Web Services.",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    instructor: "Emily Clark",
    students: 289,
    modules: 8,
    duration: "5 weeks",
    progress: 0,
    status: "available",
    category: "Design",
    description:
      "Master the principles of user interface and user experience design to build intuitive products.",
  },
  {
    id: 6,
    title: "Database Management Systems",
    instructor: "Dr. Kevin Brown",
    students: 134,
    modules: 11,
    duration: "7 weeks",
    progress: 100,
    status: "completed",
    category: "Databases",
    description:
      "Learn relational database concepts, SQL querying, and database administration essentials.",
  },
];

export default function StudentCoursesPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchesSearch;
    return matchesSearch && c.status === tab;
  });

  const tabs = [
    { key: "all", label: "All Courses" },
    { key: "enrolled", label: "Enrolled" },
    { key: "available", label: "Available" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Courses</h2>
        <p className="text-slate-500 text-sm mt-1">
          Browse, enrol, and manage your learning modules.
        </p>
      </div>

      {/* Search & Filter bar */}
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

      {/* Course grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Color strip */}
            <div className="h-2 bg-indigo-500" />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {course.category}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    course.status === "enrolled"
                      ? "bg-blue-50 text-blue-700"
                      : course.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)}
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {course.students}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {course.modules} Modules
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
              </div>

              {/* Progress or Enrol */}
              {course.status === "enrolled" || course.status === "completed" ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-700">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        course.progress === 100
                          ? "bg-emerald-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer">
                  Enrol Now
                </button>
              )}

              <p className="text-xs text-slate-500 mt-3">
                By {course.instructor}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
