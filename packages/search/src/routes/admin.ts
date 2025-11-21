import { type FastifyPluginAsync, type FastifyRequest } from 'fastify';
import {
  prismaUserRepository,
  prismaInvitationRepository,
  prismaProgramRepository,
  prismaUsageEventRepository,
} from '../prisma-repositories.js';
import { type Role } from '@prisma/client';

// Type declaration for authenticated request
interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: number;
    email: string;
    role: 'admin' | 'coach' | 'user';
  };
}

const admin: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  // All routes in this plugin are protected by the 'admin' role
  fastify.addHook('preHandler', fastify.requireRole('admin'));

  // Get all users
  fastify.get('/admin/users', async (_request, _reply) => {
    return await prismaUserRepository.getAllUsers();
  });

  // Update user role
  fastify.put('/admin/users/:id/role', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Validate ID parameter
    const userId = Number.parseInt(id, 10);
    if (Number.isNaN(userId) || userId <= 0) {
      return reply.code(400).send({
        error: 'Invalid user ID',
        error_message: 'User ID must be a positive integer',
      });
    }

    const { role } = request.body as { role: Role };

    try {
      await prismaUserRepository.updateUserRole(userId, role);
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to update user role',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get all invitations
  fastify.get('/admin/invitations', async (_request, _reply) => {
    return await prismaInvitationRepository.getAllInvitations();
  });

  // Create invitation
  fastify.post('/admin/invitations', async (request, reply) => {
    const { email, role } = request.body as { email: string; role: Role };
    const invited_by_user_id = (request as unknown as AuthenticatedRequest).user.id;
    try {
      const invitation = await prismaInvitationRepository.createInvitation({ email, role, invited_by_user_id });
      return invitation;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create invitation' });
    }
  });

  // Cancel invitation
  fastify.post('/admin/invitations/:id/cancel', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Validate ID parameter
    const invitationId = Number.parseInt(id, 10);
    if (Number.isNaN(invitationId) || invitationId <= 0) {
      return reply.code(400).send({
        error: 'Invalid invitation ID',
        error_message: 'Invitation ID must be a positive integer',
      });
    }

    try {
      await prismaInvitationRepository.updateInvitationStatus(invitationId, 'CANCELLED');
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to cancel invitation' });
    }
  });

  // Get all programs
  fastify.get('/admin/programs', async (_request, _reply) => {
    return await prismaProgramRepository.getAllPrograms();
  });

  // Get program by id
  fastify.get('/admin/programs/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Validate ID parameter
    const programId = Number.parseInt(id, 10);
    if (Number.isNaN(programId) || programId <= 0) {
      return reply.code(400).send({
        error: 'Invalid program ID',
        error_message: 'Program ID must be a positive integer',
      });
    }

    return await prismaProgramRepository.getProgramById(programId);
  });

  // Create program
  fastify.post('/admin/programs', async (request, reply) => {
    const { name, description } = request.body as { name: string; description: string };
    const created_by_user_id = (request as unknown as AuthenticatedRequest).user.id;
    try {
      const program = await prismaProgramRepository.createProgram({ name, description, created_by_user_id });
      return program;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create program' });
    }
  });

  // Get program assignments
  fastify.get('/admin/programs/:id/assignments', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Validate ID parameter
    const programId = Number.parseInt(id, 10);
    if (Number.isNaN(programId) || programId <= 0) {
      return reply.code(400).send({
        error: 'Invalid program ID',
        error_message: 'Program ID must be a positive integer',
      });
    }

    return await prismaProgramRepository.getProgramById(programId);
  });

  // Create program assignment
  fastify.post('/admin/programs/:id/assignments', async (request, reply) => {
    const { id: program_id } = request.params as { id: string };

    // Validate ID parameter
    const programId = Number.parseInt(program_id, 10);
    if (Number.isNaN(programId) || programId <= 0) {
      return reply.code(400).send({
        error: 'Invalid program ID',
        error_message: 'Program ID must be a positive integer',
      });
    }

    const { user_id } = request.body as { user_id: number; role: 'COACH' | 'PARTICIPANT' };

    // Validate user_id parameter
    if (Number.isNaN(user_id) || user_id <= 0) {
      return reply.code(400).send({
        error: 'Invalid user ID',
        error_message: 'User ID must be a positive integer',
      });
    }

    try {
      // TODO: Implement program assignment creation in Prisma repository
      return { message: 'Program assignment creation not yet implemented' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create program assignment' });
    }
  });

  // Get knowledge base overview
  fastify.get('/admin/knowledge-base', async (_request, _reply) => {
    // TODO: Implement Prisma knowledge base repository
    return { message: 'Knowledge base repository not yet migrated to Prisma' };
  });

  // Get analytics snapshot
  fastify.get('/admin/analytics', async (request, _reply) => {
    const { range } = request.query as { range: '7d' | '30d' | '90d' | '365d' };
    return await prismaUsageEventRepository.getSnapshot(range);
  });
};

export default admin;
