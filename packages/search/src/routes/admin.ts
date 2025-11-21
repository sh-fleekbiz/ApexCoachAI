import { type FastifyPluginAsync, type FastifyRequest } from 'fastify';
import { userRepository } from '../db/user-repository.js';
import { invitationRepository } from '../db/invitation-repository.js';
import { programRepository } from '../db/program-repository.js';
import { adminActionLogRepository } from '../db/admin-action-log-repository.js';
import type { User } from '../db/user-repository.js';

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
    return userRepository.getAllUsers();
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

    const { role } = request.body as { role: User['role'] };

    // Validate role
    const validRoles = ['owner', 'admin', 'coach', 'user'];
    if (!validRoles.includes(role)) {
      return reply.code(400).send({
        error: 'Invalid role',
        error_message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    try {
      // Get user before update for logging
      const user = userRepository.getUserById(userId);
      if (!user) {
        return reply.code(404).send({
          error: 'User not found',
          error_message: `User with ID ${userId} does not exist`,
        });
      }

      const oldRole = user.role;
      userRepository.updateUserRole(userId, role);

      // Log admin action
      adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'update_user_role',
        entity_type: 'user',
        entity_id: userId,
        description: `Changed user role from ${oldRole} to ${role}`,
        meta_json: { userId, oldRole, newRole: role, userEmail: user.email },
      });

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
    return invitationRepository.getAllInvitations();
  });

  // Create invitation
  fastify.post('/admin/invitations', async (request, reply) => {
    const { email, role } = request.body as { email: string; role: 'admin' | 'coach' | 'user' };
    const invited_by_user_id = (request as unknown as AuthenticatedRequest).user.id;

    // Validate role
    const validRoles = ['admin', 'coach', 'user'];
    if (!validRoles.includes(role)) {
      return reply.code(400).send({
        error: 'Invalid role',
        error_message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    try {
      const invitation = invitationRepository.createInvitation({ email, role, invited_by_user_id });

      // Log admin action
      adminActionLogRepository.createLog({
        user_id: invited_by_user_id,
        action: 'create_invitation',
        entity_type: 'invitation',
        entity_id: invitation.id,
        description: `Created invitation for ${email} with role ${role}`,
        meta_json: { invitationId: invitation.id, email, role },
      });

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
      // Get invitation before update for logging
      const invitation = invitationRepository.getInvitationById(invitationId);
      if (!invitation) {
        return reply.code(404).send({
          error: 'Invitation not found',
          error_message: `Invitation with ID ${invitationId} does not exist`,
        });
      }

      invitationRepository.updateInvitationStatus(invitationId, 'cancelled');

      // Log admin action
      adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'cancel_invitation',
        entity_type: 'invitation',
        entity_id: invitationId,
        description: `Cancelled invitation for ${invitation.email}`,
        meta_json: { invitationId, email: invitation.email, role: invitation.role },
      });

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to cancel invitation' });
    }
  });

  // Get all programs
  fastify.get('/admin/programs', async (_request, _reply) => {
    return programRepository.getAllPrograms();
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

    const program = programRepository.getProgramById(programId);
    if (!program) {
      return reply.code(404).send({
        error: 'Program not found',
        error_message: `Program with ID ${programId} does not exist`,
      });
    }

    return program;
  });

  // Create program
  fastify.post('/admin/programs', async (request, reply) => {
    const { name, description } = request.body as { name: string; description: string | null };
    const created_by_user_id = (request as unknown as AuthenticatedRequest).user.id;

    // Validate program name
    if (!name || name.trim().length === 0) {
      return reply.code(400).send({
        error: 'Invalid program name',
        error_message: 'Program name cannot be empty',
      });
    }

    try {
      const program = programRepository.createProgram({ name, description, created_by_user_id });

      // Log admin action
      adminActionLogRepository.createLog({
        user_id: created_by_user_id,
        action: 'create_program',
        entity_type: 'program',
        entity_id: program.id,
        description: `Created program: ${name}`,
        meta_json: { programId: program.id, name, description },
      });

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

    return programRepository.getProgramAssignments(programId);
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

    const { user_id, role } = request.body as { user_id: number; role: 'coach' | 'participant' };

    // Validate user_id parameter
    if (Number.isNaN(user_id) || user_id <= 0) {
      return reply.code(400).send({
        error: 'Invalid user ID',
        error_message: 'User ID must be a positive integer',
      });
    }

    // Validate role
    const validRoles = ['coach', 'participant'];
    if (!validRoles.includes(role)) {
      return reply.code(400).send({
        error: 'Invalid role',
        error_message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    try {
      // Verify user exists
      const user = userRepository.getUserById(user_id);
      if (!user) {
        return reply.code(404).send({
          error: 'User not found',
          error_message: `User with ID ${user_id} does not exist`,
        });
      }

      // Verify program exists
      const program = programRepository.getProgramById(programId);
      if (!program) {
        return reply.code(404).send({
          error: 'Program not found',
          error_message: `Program with ID ${programId} does not exist`,
        });
      }

      const assignment = programRepository.createProgramAssignment({ program_id: programId, user_id, role });

      // Log admin action
      adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'create_program_assignment',
        entity_type: 'program_assignment',
        entity_id: assignment.id,
        description: `Assigned user ${user.email} to program ${program.name} as ${role}`,
        meta_json: {
          assignmentId: assignment.id,
          programId,
          userId: user_id,
          role,
          programName: program.name,
          userEmail: user.email,
        },
      });

      return assignment;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create program assignment' });
    }
  });

  // Get knowledge base overview
  fastify.get('/admin/knowledge-base', async (_request, _reply) => {
    // TODO: Implement knowledge base repository
    return { message: 'Knowledge base repository implementation pending' };
  });

  // Get analytics snapshot
  fastify.get('/admin/analytics', async (request, _reply) => {
    const { range } = request.query as { range?: '7d' | '30d' | '90d' | '365d' };
    // TODO: Implement analytics repository
    return { message: 'Analytics repository implementation pending', range: range ?? '30d' };
  });
};

export default admin;
