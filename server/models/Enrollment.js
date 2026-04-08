const prisma = require('../config/prisma');

class Enrollment {
  constructor({ id, studentId, courseId, status, enrolledAt, course, student }) {
    this.enrollmentId = id;
    this.studentId = studentId;
    this.courseId = courseId;
    this.status = status.toLowerCase();
    this.enrolledAt = enrolledAt;
    this.courseTitle = course ? course.title : null;
    this.studentName = student ? student.name : null;
    this.studentEmail = student ? student.email : null;
  }

  static async enroll(studentId, courseId) {
    try {
      const enrollmentRow = await prisma.enrollment.create({
        data: {
          studentId: parseInt(studentId),
          courseId: parseInt(courseId),
          status: 'PENDING'
        },
        include: {
          course: true,
          student: true
        }
      });
      return new Enrollment(enrollmentRow);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Student has already requested enrollment in this course');
      }
      throw error;
    }
  }

  static async findStudentCourses(studentId, statusFilter = null) {
    const where = { studentId: parseInt(studentId) };
    if (statusFilter) {
      where.status = statusFilter.toUpperCase();
    }
    const enrollments = await prisma.enrollment.findMany({
      where,
      include: { course: true, student: true },
      orderBy: { enrolledAt: 'desc' }
    });
    return enrollments.map(e => new Enrollment(e));
  }

  static async findByCourse(courseId, statusFilter = null) {
    const where = { courseId: parseInt(courseId) };
    if (statusFilter) {
      where.status = statusFilter.toUpperCase();
    }
    const enrollments = await prisma.enrollment.findMany({
      where,
      include: { course: true, student: true },
      orderBy: { enrolledAt: 'desc' }
    });
    return enrollments.map(e => new Enrollment(e));
  }

  static async updateStatus(enrollmentId, newStatus) {
    const enrollmentRow = await prisma.enrollment.update({
      where: { id: parseInt(enrollmentId) },
      data: { status: newStatus.toUpperCase() },
      include: { course: true, student: true }
    });
    return new Enrollment(enrollmentRow);
  }

  static async checkEnrollment(studentId, courseId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: parseInt(studentId),
          courseId: parseInt(courseId)
        }
      }
    });
    return enrollment;
  }
}

module.exports = Enrollment;
