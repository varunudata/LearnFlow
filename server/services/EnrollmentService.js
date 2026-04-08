const Enrollment = require('../models/Enrollment');
const CourseService = require('./CourseService');

class EnrollmentService {
  async enrollStudent(studentId, courseId) {
    // Check if course exists first
    await CourseService.getCourseById(courseId);
    
    // Create enrollment (defaults to PENDING)
    return await Enrollment.enroll(studentId, courseId);
  }

  async getStudentCourses(studentId, status = null) {
    return await Enrollment.findStudentCourses(studentId, status);
  }

  async getCourseEnrollments(courseId, status = null) {
    return await Enrollment.findByCourse(courseId, status);
  }

  async approveEnrollment(enrollmentId) {
    return await Enrollment.updateStatus(enrollmentId, 'APPROVED');
  }

  async rejectEnrollment(enrollmentId) {
    return await Enrollment.updateStatus(enrollmentId, 'REJECTED');
  }
}

module.exports = new EnrollmentService();
