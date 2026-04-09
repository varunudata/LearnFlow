const prisma = require('../config/prisma');

class Submission {
  constructor({ id, content, fileUrl, submittedAt, grade, studentId, assignmentId, student }) {
    this.submissionId = id;
    this.content = content;
    this.fileUrl = fileUrl || null;
    this.submittedAt = submittedAt;
    this.grade = grade;
    this.studentId = studentId;
    this.assignmentId = assignmentId;
    this.studentName = student ? student.name : null;
  }

  static async submit(content, fileUrl, studentId, assignmentId) {
    try {
      const submissionRow = await prisma.submission.upsert({
        where: {
          studentId_assignmentId: {
            studentId: parseInt(studentId),
            assignmentId: parseInt(assignmentId)
          }
        },
        update: {
          content,
          fileUrl: fileUrl || null,
          submittedAt: new Date()
        },
        create: {
          content,
          fileUrl: fileUrl || null,
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId)
        }
      });
      return new Submission(submissionRow);
    } catch (error) {
      throw error;
    }
  }

  static async findByAssignment(assignmentId) {
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: parseInt(assignmentId) },
      include: { student: true },
      orderBy: { submittedAt: 'desc' }
    });
    return submissions.map(s => new Submission(s));
  }

  static async findStudentSubmission(studentId, assignmentId) {
    const submissionRow = await prisma.submission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId)
        }
      }
    });
    if (!submissionRow) return null;
    return new Submission(submissionRow);
  }

  static async findById(submissionId) {
    const submissionRow = await prisma.submission.findUnique({
      where: { id: parseInt(submissionId) }
    });
    if (!submissionRow) return null;
    return new Submission(submissionRow);
  }

  async setGrade(grade) {
    const updatedRow = await prisma.submission.update({
      where: { id: this.submissionId },
      data: { grade: parseInt(grade) }
    });
    this.grade = updatedRow.grade;
    return this;
  }

  toJSON() {
    return {
      submissionId: this.submissionId,
      content: this.content,
      fileUrl: this.fileUrl,
      submittedAt: this.submittedAt,
      grade: this.grade,
      studentId: this.studentId,
      assignmentId: this.assignmentId,
      studentName: this.studentName
    };
  }
}

module.exports = Submission;
