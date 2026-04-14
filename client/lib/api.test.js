import api from './api';
import axios from 'axios';

// Mock axios completely
jest.mock('axios', () => {
  const mockInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    create: jest.fn(() => mockInstance),
  };
  return mockInstance;
});

describe('API Interceptor', () => {
  let requestInterceptor;
  let responseInterceptorError;

  beforeAll(() => {
    // These calls happened when api.js was imported
    // We need to find the calls on the mock
    requestInterceptor = api.interceptors.request.use.mock.calls[0][0];
    responseInterceptorError = api.interceptors.response.use.mock.calls[0][1];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('should add Authorization header if token exists', () => {
    const token = 'test-token';
    window.localStorage.getItem.mockReturnValue(token);

    const config = { headers: {} };
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('should not add Authorization header if token does not exist', () => {
    window.localStorage.getItem.mockReturnValue(null);

    const config = { headers: {} };
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should clear localStorage on 401 error', async () => {
    const error = {
      response: { status: 401 }
    };

    try {
      await responseInterceptorError(error);
    } catch (e) {
      // Expected rejection
    }

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('learnflow_token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('learnflow_user');
  });
});
