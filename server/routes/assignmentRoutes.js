const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/AssignmentController');
const requireAuth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Student: get all assignments across enrolled courses
router.get('/my-assignments', requireAuth, requireRole('student'), assignmentController.getMyAssignments);

// Both can view assignments for a course
router.get('/course/:courseId', requireAuth, assignmentController.getCourseAssignments);

// Faculty only
router.post('/', requireAuth, requireRole('faculty'), assignmentController.createAssignment);

module.exports = router;
