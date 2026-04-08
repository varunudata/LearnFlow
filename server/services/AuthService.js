const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

class AuthService {
  /**
   * Register a new user enforcing role logic
   */
  async register(name, email, password, role) {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    let newUser;
    if (role === 'student') {
      newUser = await Student.create({ name, email, password });
    } else if (role === 'faculty') {
      newUser = await Faculty.create({ name, email, password });
    } else {
      throw new Error('Invalid role specified');
    }

    return newUser;
  }

  /**
   * Authenticate a user and generate a JWT token
   */
  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    
    return { user, token };
  }

  /**
   * Internal method to generate JWT
   */
  generateToken(user) {
    const payload = {
      userId: user.userId,
      role: user.role,
    };
    
    // Ensure you have JWT_SECRET in your .env
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '24h',
    });
  }
}

module.exports = new AuthService();
