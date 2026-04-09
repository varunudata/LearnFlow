const AssignmentService = require('../services/AssignmentService');
const prisma = require('../config/prisma');

class AssignmentController {
  async createAssignment(req, res) {
    try {
      const { title, description, deadline, courseId } = req.body;
      const facultyId = req.user.userId;
      
      const assignment = await AssignmentService.createAssignment(title, description, deadline, courseId, facultyId);
      res.status(201).json(assignment.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCourseAssignments(req, res) {
    try {
      const { courseId } = req.params;
      const assignments = await AssignmentService.getCourseAssignments(courseId);
      res.json(assignments.map(a => a.toJSON()));
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getMyAssignments(req, res) {
    try {
      const studentId = req.user.userId;

      // Get all courses the student is APPROVED for
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId, status: 'APPROVED' },
        select: { courseId: true }
      });
      const courseIds = enrollments.map(e => e.courseId);

      if (courseIds.length === 0) {
        return res.json([]);
      }

      // Get all assignments for those courses, with this student's submission
      const assignments = await prisma.assignment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          course: { select: { title: true } },
          submissions: {
            where: { studentId },
            select: { id: true, grade: true, submittedAt: true, content: true, fileUrl: true }
          }
        },
        orderBy: { deadline: 'asc' }
      });

      const result = assignments.map(a => {
        const sub = a.submissions[0] || null;
        let status = 'pending';
        if (sub && sub.grade !== null) status = 'graded';
        else if (sub) status = 'submitted';

        return {
          assignmentId: a.id,
          title: a.title,
          description: a.description,
          course: a.course.title,
          courseId: a.courseId,
          deadline: a.deadline,
          status,
          submissionId: sub ? sub.id : null,
          grade: sub ? sub.grade : null,
          maxScore: 100,
          submittedAt: sub ? sub.submittedAt : null,
          fileUrl: sub ? sub.fileUrl : null,
        };
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  }
}

module.exports = new AssignmentController();
