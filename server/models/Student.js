const User = require('./User');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

class Student extends User {
  constructor(userData) {
    super(userData);
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRow = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
      }
    });
    return new Student(userRow);
  }
}

module.exports = Student;
