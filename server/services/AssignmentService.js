const Assignment = require('../models/Assignment');
const CourseService = require('./CourseService');

class AssignmentService {
  async createAssignment(title, description, deadline, courseId, facultyId) {
    // Ensure course exists and belongs to this faculty
    const course = await CourseService.getCourseById(courseId);
    if (course.facultyId !== facultyId) {
      throw new Error('Unauthorized: You do not own this course');
    }
    
    if (!title || !deadline) {
      throw new Error('Title and deadline are required');
    }
    
    return await Assignment.create(title, description, deadline, courseId);
  }

  async getCourseAssignments(courseId) {
    await CourseService.getCourseById(courseId);
    return await Assignment.findByCourse(courseId);
  }
}

module.exports = new AssignmentService();
