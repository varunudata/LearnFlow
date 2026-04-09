const prisma = require('../config/prisma');

class Assignment {
  constructor({ id, title, description, deadline, courseId, createdAt }) {
    this.assignmentId = id;
    this.title = title;
    this.description = description || null;
    this.deadline = deadline;
    this.courseId = courseId;
    this.createdAt = createdAt;
  }

  static async create(title, description, deadline, courseId) {
    const assignmentRow = await prisma.assignment.create({
      data: {
        title,
        description: description || null,
        deadline: new Date(deadline),
        courseId: parseInt(courseId)
      }
    });
    return new Assignment(assignmentRow);
  }

  static async findByCourse(courseId) {
    const assignments = await prisma.assignment.findMany({
      where: { courseId: parseInt(courseId) },
      orderBy: { createdAt: 'desc' }
    });
    return assignments.map(a => new Assignment(a));
  }

  static async findById(assignmentId) {
    const assignmentRow = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId) }
    });
    if (!assignmentRow) return null;
    return new Assignment(assignmentRow);
  }

  toJSON() {
    return {
      assignmentId: this.assignmentId,
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      courseId: this.courseId,
      createdAt: this.createdAt
    };
  }
}

module.exports = Assignment;
