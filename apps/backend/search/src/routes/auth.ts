import bcrypt from 'bcryptjs';
import { type FastifyPluginAsync } from 'fastify';
import { usageEventRepository } from '../db/usage-event-repository.js';
import { userRepository } from '../db/user-repository.js';

const auth: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  // Signup route
  fastify.post('/auth/signup', {
    schema: {
      description: 'Sign up a new user',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        400: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const { email, password, name } = request.body as {
        email: string;
        password: string;
        name?: string;
      };

      try {
        // Check if user already exists
        const existingUser = await await userRepository.getUserByEmail(email);
        if (existingUser) {
          return reply
            .code(400)
            .send({ error: 'User with this email already exists' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await await userRepository.createUser({
          email,
          password_hash,
          name,
        });

        // Generate JWT token
        const token = fastify.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        // Log usage event
        await usageEventRepository.createUsageEvent({
          user_id: user.id,
          type: 'login',
        });

        // Set cookie - sameSite: 'none' required for cross-origin requests
        reply.setCookie('token', token, {
          httpOnly: true,
          secure: true, // Required for sameSite: 'none'
          sameSite: 'none',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to create user' });
      }
    },
  });

  // Login route
  fastify.post('/auth/login', {
    schema: {
      description: 'Log in a user',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        // Find user
        const user = await await userRepository.getUserByEmail(email);
        if (!user) {
          return reply.code(401).send({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isValidPassword) {
          return reply.code(401).send({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = fastify.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        // Set cookie
        reply.setCookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to log in' });
      }
    },
  });

  // Logout route
  fastify.post('/auth/logout', {
    schema: {
      description: 'Log out a user',
      tags: ['auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async function (_request, reply) {
      // Clear cookie
      reply.clearCookie('token', { path: '/' });
      return { message: 'Logged out successfully' };
    },
  });

  // Get demo users route
  fastify.get('/auth/demo-users', {
    schema: {
      description: 'Get available demo user roles',
      tags: ['auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            demoUsers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string' },
                  label: { type: 'string' },
                  email: { type: 'string' },
                  userRole: { type: 'string' },
                },
              },
            },
          },
        },
        403: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: { $ref: 'httpError' },
      },
    },
    handler: async function (_request, reply) {
      const enableDemoLogin = process.env.ENABLE_DEMO_LOGIN === 'true';

      if (!enableDemoLogin) {
        return reply.code(403).send({ error: 'Demo login is disabled' });
      }

      try {
        const demoUsers = await await userRepository.getDemoUsers();

        return {
          demoUsers: demoUsers.map((user) => ({
            role: user.demo_role || 'unknown',
            label: user.demo_label || user.name || 'Demo User',
            email: user.email,
            userRole: user.role,
          })),
        };
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to fetch demo users' });
      }
    },
  });

  // Demo login route (updated to support role selection)
  fastify.post('/auth/demo-login', {
    schema: {
      description: 'Log in with demo account',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          role: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isDemo: { type: 'boolean' },
                demoRole: { type: 'string' },
                demoLabel: { type: 'string' },
              },
            },
          },
        },
        400: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const enableDemoLogin = process.env.ENABLE_DEMO_LOGIN === 'true';

      if (!enableDemoLogin) {
        return reply.code(403).send({ error: 'Demo login is disabled' });
      }

      const { role } = (request.body as { role?: string }) || {};

      try {
        let user;

        // If role is specified, find demo user by role
        if (role) {
          user = await await userRepository.getDemoUserByRole(role);
          if (!user) {
            return reply
              .code(400)
              .send({ error: `Demo user with role '${role}' not found` });
          }
        } else {
          // Fallback: get first demo user (for backward compatibility)
          const demoUsers = await await userRepository.getDemoUsers();
          if (demoUsers.length === 0) {
            return reply.code(500).send({ error: 'No demo users available' });
          }
          user = demoUsers[0];
        }

        // Generate JWT token
        const token = fastify.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        // Log usage event
        await await usageEventRepository.createUsageEvent({
          user_id: user.id,
          type: 'login',
        });

        // Set cookie - sameSite: 'none' required for cross-origin requests
        reply.setCookie('token', token, {
          httpOnly: true,
          secure: true, // Required for sameSite: 'none'
          sameSite: 'none',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isDemo: user.is_demo,
            demoRole: user.demo_role,
            demoLabel: user.demo_label,
          },
        };
      } catch (error: any) {
        fastify.log.error(error);
        return reply
          .code(500)
          .send({ error: 'Failed to log in with demo account' });
      }
    },
  });

  // Old demo login route (deprecated, kept for backward compatibility)
  fastify.post('/auth/demo-login-legacy', {
    schema: {
      description: 'Log in with demo account (deprecated)',
      tags: ['auth'],
      deprecated: true,
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        500: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const demoEmail = 'demo@apexcoachai.com';
      const demoPassword = 'demo123456';

      try {
        // Check if demo user exists
        let user = await await userRepository.getUserByEmail(demoEmail);

        // Create demo user if it doesn't exist
        if (!user) {
          const password_hash = await bcrypt.hash(demoPassword, 10);
          user = await await userRepository.createUser({
            email: demoEmail,
            password_hash,
            name: 'Demo User',
          });
        }

        // Generate JWT token
        const token = fastify.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        // Log usage event
        await await usageEventRepository.createUsageEvent({
          user_id: user.id,
          type: 'login',
        });

        // Set cookie - sameSite: 'none' required for cross-origin requests
        reply.setCookie('token', token, {
          httpOnly: true,
          secure: true, // Required for sameSite: 'none'
          sameSite: 'none',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      } catch (error: any) {
        fastify.log.error(error);
        return reply
          .code(500)
          .send({ error: 'Failed to log in with demo account' });
      }
    },
  });

  // Get current user route (protected)
  fastify.get('/auth/me', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Get current user',
      tags: ['auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
      },
    },
    handler: async function (request, _reply) {
      const user = await await userRepository.getUserById(request.user!.id);
      return {
        user: {
          id: user!.id,
          email: user!.email,
          name: user!.name,
          role: user!.role,
        },
      };
    },
  });
};

export default auth;
