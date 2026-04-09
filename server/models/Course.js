const prisma = require('../config/prisma');

class Course {
  constructor({ id, title, description, category, level, thumbnail, facultyId, createdAt, faculty, modules }) {
    this.courseId = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.level = level;
    this.thumbnail = thumbnail;
    this.facultyId = facultyId;
    this.createdAt = createdAt;
    this.facultyName = faculty ? faculty.name : null;
    this.modules = modules || [];
  }

  static async create(title, description, category, level, thumbnail, facultyId, modules = []) {
    const courseRow = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        thumbnail,
        facultyId,
        modules: {
          create: modules.map((m, i) => ({
            title: m.title,
            description: m.description,
            orderIndex: i
          }))
        }
      },
      include: {
        faculty: true,
        modules: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    return new Course(courseRow);
  }

  static async findAll() {
    const courses = await prisma.course.findMany({
      include: { 
        faculty: true,
        modules: { orderBy: { orderIndex: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return courses.map(c => new Course(c));
  }

  static async findByFaculty(facultyId) {
    const courses = await prisma.course.findMany({
      where: { facultyId },
      include: { 
        faculty: true,
        modules: { orderBy: { orderIndex: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return courses.map(c => new Course(c));
  }

  static async findById(courseId) {
    const courseRow = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { 
        faculty: true,
        modules: { orderBy: { orderIndex: 'asc' } }
      }
    });
    if (!courseRow) return null;
    return new Course(courseRow);
  }

  async update(updates) {
    const courseRow = await prisma.course.update({
      where: { id: this.courseId },
      data: updates,
      include: { 
        faculty: true,
        modules: { orderBy: { orderIndex: 'asc' } }
      }
    });
    Object.assign(this, new Course(courseRow));
    return this;
  }

  async delete() {
    await prisma.course.delete({
      where: { id: this.courseId }
    });
  }

  toJSON() {
    return {
      courseId: this.courseId,
      title: this.title,
      description: this.description,
      category: this.category,
      level: this.level,
      thumbnail: this.thumbnail,
      facultyId: this.facultyId,
      facultyName: this.facultyName,
      createdAt: this.createdAt,
      modules: this.modules
    };
  }
}

module.exports = Course;
