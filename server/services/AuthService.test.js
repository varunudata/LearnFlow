const jwt = require('jsonwebtoken');
const authService = require('./AuthService');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../models/Student');
jest.mock('../models/Faculty');

describe('AuthService', () => {
  describe('register', () => {
    it('should throw error if user already exists', async () => {
      User.findByEmail.mockResolvedValue({ id: 1 });
      await expect(authService.register('Name', 'test@test.com', 'pass', 'student'))
        .rejects.toThrow('User with this email already exists');
    });

    it('should create a student if role is student', async () => {
      User.findByEmail.mockResolvedValue(null);
      Student.create.mockResolvedValue({ id: 1, role: 'student' });
      
      const user = await authService.register('Student', 's@test.com', 'pass', 'student');
      
      expect(Student.create).toHaveBeenCalledWith({ name: 'Student', email: 's@test.com', password: 'pass' });
      expect(user.role).toBe('student');
    });

    it('should create a faculty if role is faculty', async () => {
      User.findByEmail.mockResolvedValue(null);
      Faculty.create.mockResolvedValue({ id: 2, role: 'faculty' });
      
      const user = await authService.register('Faculty', 'f@test.com', 'pass', 'faculty');
      
      expect(Faculty.create).toHaveBeenCalledWith({ name: 'Faculty', email: 'f@test.com', password: 'pass' });
      expect(user.role).toBe('faculty');
    });

    it('should throw error for invalid role', async () => {
      User.findByEmail.mockResolvedValue(null);
      await expect(authService.register('Name', 'test@test.com', 'pass', 'admin'))
        .rejects.toThrow('Invalid role specified');
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      User.findByEmail.mockResolvedValue(null);
      await expect(authService.login('no@test.com', 'pass'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password invalid', async () => {
      const mockUser = { validatePassword: jest.fn().mockResolvedValue(false) };
      User.findByEmail.mockResolvedValue(mockUser);
      await expect(authService.login('test@test.com', 'wrong'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should return user and token if credentials are valid', async () => {
      const mockUser = { 
        userId: 1, 
        role: 'student', 
        validatePassword: jest.fn().mockResolvedValue(true) 
      };
      User.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      const result = await authService.login('test@test.com', 'correct');
      
      expect(result.user).toBe(mockUser);
      expect(result.token).toBe('mock-token');
    });
  });
});
