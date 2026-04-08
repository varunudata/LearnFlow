const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

class User {
  constructor({ id, name, email, password, role }) {
    this.userId = id;
    this.name = name;
    this.email = email;
    this.password = password; 
    this.role = role.toLowerCase();
  }

  async validatePassword(rawPassword) {
    return await bcrypt.compare(rawPassword, this.password);
  }

  static async findByEmail(email) {
    const userRow = await prisma.user.findUnique({ where: { email } });
    if (!userRow) return null;
    return this._mapToClass(userRow);
  }

  static async findById(userId) {
    const userRow = await prisma.user.findUnique({ where: { id: userId } });
    if (!userRow) return null;
    return this._mapToClass(userRow);
  }

  static _mapToClass(userRow) {
    const Student = require('./Student');
    const Faculty = require('./Faculty');
    
    if (userRow.role === 'STUDENT') {
      return new Student(userRow);
    } else if (userRow.role === 'FACULTY') {
      return new Faculty(userRow);
    }
    return new User(userRow);
  }

  toJSON() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = User;
