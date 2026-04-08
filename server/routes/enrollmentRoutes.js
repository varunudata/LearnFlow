const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/EnrollmentController');
const requireAuth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Student routes
router.post('/enroll', requireAuth, requireRole('student'), enrollmentController.enroll);
router.get('/my-courses', requireAuth, requireRole('student'), enrollmentController.getMyCourses);

// Faculty routes
router.get('/pending', requireAuth, requireRole('faculty'), enrollmentController.getMyPendingEnrollments);
router.get('/course/:courseId', requireAuth, requireRole('faculty'), enrollmentController.getCourseEnrollments);
router.put('/approve/:enrollmentId', requireAuth, requireRole('faculty'), enrollmentController.approveEnrollment);
router.put('/reject/:enrollmentId', requireAuth, requireRole('faculty'), enrollmentController.rejectEnrollment);

module.exports = router;
