const CourseService = require('../services/CourseService');

class CourseController {
  async createCourse(req, res) {
    try {
      const { title, description, category, level, thumbnail, modules } = req.body;
      const facultyId = req.user.userId; // Provided by auth middleware

      const course = await CourseService.createCourse(title, description, category, level, thumbnail, facultyId, modules);
      res.status(201).json(course.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      res.json(courses.map(c => c.toJSON()));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  }

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const facultyId = req.user.userId;

      const course = await CourseService.updateCourse(id, facultyId, req.body);
      res.json(course.toJSON());
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const facultyId = req.user.userId;

      await CourseService.deleteCourse(id, facultyId);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new CourseController();
