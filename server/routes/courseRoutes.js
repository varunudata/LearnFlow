const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const requireAuth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Public route (if authenticated)
router.get('/', requireAuth, courseController.getCourses);

// Faculty specific routes
router.post('/', requireAuth, requireRole('faculty'), courseController.createCourse);
router.put('/:id', requireAuth, requireRole('faculty'), courseController.updateCourse);
router.delete('/:id', requireAuth, requireRole('faculty'), courseController.deleteCourse);

module.exports = router;
