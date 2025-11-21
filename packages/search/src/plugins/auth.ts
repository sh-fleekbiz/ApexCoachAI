import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

export default fp(async (fastify, _options): Promise<void> => {
  // Register cookie plugin
  await fastify.register(fastifyCookie);

  // Register JWT plugin
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Add authentication decorator
  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Add role-based authorization decorator
  fastify.decorate('requireRole', function (role: 'owner' | 'admin' | 'coach' | 'user') {
    return async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
        const userRole = request.user.role;

        // Owner has access to everything
        if (userRole === 'owner') {
          return;
        }

        if (role === 'owner' && userRole !== 'owner') {
          reply.code(403).send({ error: 'Forbidden: Owner access required' });
        } else if (role === 'admin' && !['owner', 'admin'].includes(userRole)) {
          reply.code(403).send({ error: 'Forbidden: Admin access required' });
        } else if (role === 'coach' && !['owner', 'admin', 'coach'].includes(userRole)) {
          reply.code(403).send({ error: 'Forbidden: Coach access required' });
        }
      } catch {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    };
  });

  // Add convenience decorators for common role checks
  fastify.decorate('requireOwner', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      const userRole = request.user.role;

      if (userRole !== 'owner') {
        return reply.code(403).send({ error: 'Forbidden: Owner access required' });
      }
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.decorate('requireAdmin', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      const userRole = request.user.role;

      if (!['owner', 'admin'].includes(userRole)) {
        return reply.code(403).send({ error: 'Forbidden: Admin access required' });
      }
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.decorate('requireCoach', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      const userRole = request.user.role;

      if (!['owner', 'admin', 'coach'].includes(userRole)) {
        return reply.code(403).send({ error: 'Forbidden: Coach access required' });
      }
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    requireRole: (role: 'owner' | 'admin' | 'coach' | 'user') => (request: any, reply: any) => Promise<void>;
    requireOwner: (request: any, reply: any) => Promise<void>;
    requireAdmin: (request: any, reply: any) => Promise<void>;
    requireCoach: (request: any, reply: any) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      role: 'owner' | 'admin' | 'coach' | 'user';
    };
  }
}
