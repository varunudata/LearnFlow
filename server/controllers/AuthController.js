const authService = require('../services/AuthService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.register(name, email, password, role);
      res.status(201).json({ message: 'User created successfully', user: user.toJSON() });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ message: 'Login successful', token, user: user.toJSON() });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
