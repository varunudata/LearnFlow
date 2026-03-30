import { Award, Download, ExternalLink, Calendar } from "lucide-react";

const certificates = [
  {
    id: "CERT-2026-9012",
    course: "Database Management Systems",
    instructor: "Dr. Kevin Brown",
    issueDate: "Mar 20, 2026",
    skills: ["SQL", "Relational Databases", "Data Modeling", "Normalization"],
    grade: "A+",
  },
  {
    id: "CERT-2025-4567",
    course: "Python for Beginners",
    instructor: "Dr. Sarah Wilson",
    issueDate: "Nov 15, 2025",
    skills: ["Python", "Scripting", "Data Structures", "Algorithms"],
    grade: "A",
  },
];

export default function StudentCertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Certificates</h2>
        <p className="text-slate-500 text-sm mt-1">
          View and download your earned certificates for completed courses.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Top Pattern Area */}
            <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-30 mix-blend-screen" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-30 mix-blend-screen" />

              {/* Badge */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-xl">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {cert.course}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Instructor: {cert.instructor}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Grade
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {cert.grade}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Issued: {cert.issueDate}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Skills Validated
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Verify Authenticity"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center mt-3 text-xs text-slate-400 font-mono">
                ID: {cert.id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
