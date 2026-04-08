const Course = require('../models/Course');

class CourseService {
  async createCourse(title, description, category, level, thumbnail, facultyId, modules = []) {
    if (!title) throw new Error('Course title is required');
    return await Course.create(title, description, category, level, thumbnail, facultyId, modules);
  }

  async getAllCourses() {
    return await Course.findAll();
  }

  async getFacultyCourses(facultyId) {
    return await Course.findByFaculty(facultyId);
  }

  async getCourseById(courseId) {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    return course;
  }

  async updateCourse(courseId, facultyId, updates) {
    const course = await this.getCourseById(courseId);
    
    // Authorization check
    if (course.facultyId !== facultyId) {
      throw new Error('Unauthorized: You do not own this course');
    }

    return await course.update(updates);
  }

  async deleteCourse(courseId, facultyId) {
    const course = await this.getCourseById(courseId);
    
    // Authorization check
    if (course.facultyId !== facultyId) {
      throw new Error('Unauthorized: You do not own this course');
    }

    await course.delete();
  }
}

module.exports = new CourseService();
