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
  fastify.decorate('requireRole', function (role: 'admin' | 'coach' | 'user') {
    return async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
        const userRole = request.user.role;

        if (role === 'admin' && userRole !== 'admin') {
          reply.code(403).send({ error: 'Forbidden' });
        } else if (role === 'coach' && !['admin', 'coach'].includes(userRole)) {
          reply.code(403).send({ error: 'Forbidden' });
        }
      } catch {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    };
  });
});

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    requireRole: (role: 'admin' | 'coach' | 'user') => (request: any, reply: any) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      role: 'admin' | 'coach' | 'user';
    };
  }
}
