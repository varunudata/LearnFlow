const SubmissionService = require('../services/SubmissionService');

class SubmissionController {
  async submitAssignment(req, res) {
    try {
      const { content, assignmentId } = req.body;
      const studentId = req.user.userId;

      // Get file URL if a file was uploaded
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const submission = await SubmissionService.submitAssignment(content, fileUrl, studentId, assignmentId);
      res.status(201).json(submission.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAssignmentSubmissions(req, res) {
    try {
      const { assignmentId } = req.params;
      const facultyId = req.user.userId;

      const submissions = await SubmissionService.getAssignmentSubmissions(assignmentId, facultyId);
      res.json(submissions.map(s => s.toJSON()));
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async gradeSubmission(req, res) {
    try {
      const { submissionId } = req.params;
      const { grade } = req.body;
      const facultyId = req.user.userId;

      const submission = await SubmissionService.gradeSubmission(submissionId, grade, facultyId);
      res.json(submission.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SubmissionController();
