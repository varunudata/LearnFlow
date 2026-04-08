const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const CourseService = require('./CourseService');
const Enrollment = require('../models/Enrollment');

class SubmissionService {
  async submitAssignment(content, fileUrl, studentId, assignmentId) {
    if (!content && !fileUrl) throw new Error('Submission content or file is required');

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const enrollment = await Enrollment.checkEnrollment(studentId, assignment.courseId);
    if (!enrollment || enrollment.status !== 'APPROVED') {
      throw new Error('Cannot submit to a course you are not approved for');
    }

    return await Submission.submit(content || '', fileUrl, studentId, assignmentId);
  }

  async getAssignmentSubmissions(assignmentId, facultyId) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const course = await CourseService.getCourseById(assignment.courseId);
    if (course.facultyId !== facultyId) {
      throw new Error('Unauthorized: You do not own this course');
    }
    
    return await Submission.findByAssignment(assignmentId);
  }

  async gradeSubmission(submissionId, grade, facultyId) {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found');

    const assignment = await Assignment.findById(submission.assignmentId);
    
    const course = await CourseService.getCourseById(assignment.courseId);
    if (course.facultyId !== facultyId) {
      throw new Error('Unauthorized: You do not own this course');
    }
    
    if (grade === undefined || grade < 0 || grade > 100) {
      throw new Error('Valid grade (0-100) is required');
    }

    return await submission.setGrade(grade);
  }
}

module.exports = new SubmissionService();
