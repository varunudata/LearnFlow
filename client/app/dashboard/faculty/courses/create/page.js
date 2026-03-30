"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FacultyCourseCreationPage() {
  const [modules, setModules] = useState([
    { id: 1, title: "", description: "" },
  ]);

  const addModule = () => {
    setModules([...modules, { id: Date.now(), title: "", description: "" }]);
  };

  const removeModule = (id) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  const updateModule = (id, field, value) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/faculty/courses"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create New Course
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Draft a new course and construct its learning modules.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">
          <Save className="w-4 h-4" /> Save Draft
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-4">
              Basic Details
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Course Title
              </label>
              <input
                type="text"
                placeholder="e.g. Advanced web development concepts"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows="4"
                placeholder="Briefly describe what students will learn..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-semibold text-slate-900">
                Curriculum Modules
              </h3>
              <span className="text-sm font-medium text-slate-500">
                {modules.length} Modules
              </span>
            </div>

            <div className="space-y-4">
              {modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50 relative group"
                >
                  <div className="pt-2 cursor-grab text-slate-400 hover:text-slate-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Module {index + 1}
                      </h4>
                      <button
                        onClick={() => removeModule(mod.id)}
                        disabled={modules.length === 1}
                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Module Title"
                        value={mod.title}
                        onChange={(e) =>
                          updateModule(mod.id, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                      />
                      <textarea
                        rows="2"
                        placeholder="Module objectives..."
                        value={mod.description}
                        onChange={(e) =>
                          updateModule(mod.id, "description", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addModule}
              className="w-full py-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-4">
              Settings
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow cursor-pointer">
                <option value="">Select category...</option>
                <option value="cs">Computer Science</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Level
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow cursor-pointer">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Thumbnail Cover
              </label>
              <div className="w-full h-32 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Upload Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
