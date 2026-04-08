const EnrollmentService = require('../services/EnrollmentService');

class EnrollmentController {
  async enroll(req, res) {
    try {
      const { courseId } = req.body;
      const studentId = req.user.userId;
      
      const enrollment = await EnrollmentService.enrollStudent(studentId, courseId);
      res.status(201).json({
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseTitle: enrollment.courseTitle,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyCourses(req, res) {
    try {
      const studentId = req.user.userId;
      const enrollments = await EnrollmentService.getStudentCourses(studentId);
      res.json(enrollments.map(e => ({
        enrollmentId: e.enrollmentId,
        courseId: e.courseId,
        courseTitle: e.courseTitle,
        status: e.status,
        enrolledAt: e.enrolledAt,
      })));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
  }

  // Faculty: get all enrollment requests for a specific course
  async getCourseEnrollments(req, res) {
    try {
      const { courseId } = req.params;
      const { status } = req.query; // optional filter: ?status=pending
      const enrollments = await EnrollmentService.getCourseEnrollments(courseId, status);
      res.json(enrollments.map(e => ({
        enrollmentId: e.enrollmentId,
        studentId: e.studentId,
        studentName: e.studentName,
        studentEmail: e.studentEmail,
        courseId: e.courseId,
        courseTitle: e.courseTitle,
        status: e.status,
        enrolledAt: e.enrolledAt,
      })));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
  }

  // Faculty: get ALL pending enrollments across all their courses
  async getMyPendingEnrollments(req, res) {
    try {
      const facultyId = req.user.userId;
      const prisma = require('../config/prisma');

      const pendingEnrollments = await prisma.enrollment.findMany({
        where: {
          status: 'PENDING',
          course: { facultyId }
        },
        include: {
          student: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } }
        },
        orderBy: { enrolledAt: 'desc' }
      });

      res.json(pendingEnrollments.map(e => ({
        enrollmentId: e.id,
        studentId: e.student.id,
        studentName: e.student.name,
        studentEmail: e.student.email,
        courseId: e.course.id,
        courseTitle: e.course.title,
        status: e.status.toLowerCase(),
        enrolledAt: e.enrolledAt,
      })));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pending enrollments' });
    }
  }

  async approveEnrollment(req, res) {
    try {
      const { enrollmentId } = req.params;
      const enrollment = await EnrollmentService.approveEnrollment(enrollmentId);
      res.json({
        enrollmentId: enrollment.enrollmentId,
        status: enrollment.status,
        studentName: enrollment.studentName,
        courseTitle: enrollment.courseTitle,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejectEnrollment(req, res) {
    try {
      const { enrollmentId } = req.params;
      const enrollment = await EnrollmentService.rejectEnrollment(enrollmentId);
      res.json({
        enrollmentId: enrollment.enrollmentId,
        status: enrollment.status,
        studentName: enrollment.studentName,
        courseTitle: enrollment.courseTitle,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new EnrollmentController();
