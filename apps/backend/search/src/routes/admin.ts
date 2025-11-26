import { type FastifyPluginAsync, type FastifyRequest } from 'fastify';
import { adminActionLogRepository } from '../db/admin-action-log-repository.js';
import { invitationRepository } from '../db/invitation-repository.js';
import { knowledgeBaseRepository } from '../db/knowledge-base-repository.js';
import { programRepository } from '../db/program-repository.js';
import type { User } from '../db/user-repository.js';
import { userRepository } from '../db/user-repository.js';

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
    return await await userRepository.getAllUsers();
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
      const user = await await userRepository.getUserById(userId);
      if (!user) {
        return reply.code(404).send({
          error: 'User not found',
          error_message: `User with ID ${userId} does not exist`,
        });
      }

      const oldRole = user.role;
      await userRepository.updateUserRole(userId, role);

      // Log admin action
      try {
        await adminActionLogRepository.createLog({
          user_id: (request as unknown as AuthenticatedRequest).user.id,
          action: 'update_user_role',
          entity_type: 'user',
          entity_id: userId,
          description: `Changed user role from ${oldRole} to ${role}`,
          meta_json: { userId, oldRole, newRole: role, userEmail: user.email },
        });
      } catch (logError) {
        fastify.log.error(
          { err: logError },
          'Failed to log admin action for update_user_role'
        );
        throw logError;
      }

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
    return await await invitationRepository.getAllInvitations();
  });

  // Create invitation
  fastify.post('/admin/invitations', async (request, reply) => {
    const { email, role } = request.body as {
      email: string;
      role: 'admin' | 'coach' | 'user';
    };
    const invited_by_user_id = (request as unknown as AuthenticatedRequest).user
      .id;

    // Validate role
    const validRoles = ['admin', 'coach', 'user'];
    if (!validRoles.includes(role)) {
      return reply.code(400).send({
        error: 'Invalid role',
        error_message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    try {
      const invitation = await await invitationRepository.createInvitation({
        email,
        role,
        invited_by_user_id,
      });

      // Log admin action
      await adminActionLogRepository.createLog({
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
      const invitation =
        await await invitationRepository.getInvitationById(invitationId);
      if (!invitation) {
        return reply.code(404).send({
          error: 'Invitation not found',
          error_message: `Invitation with ID ${invitationId} does not exist`,
        });
      }

      await invitationRepository.updateInvitationStatus(
        invitationId,
        'cancelled'
      );

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'cancel_invitation',
        entity_type: 'invitation',
        entity_id: invitationId,
        description: `Cancelled invitation for ${invitation.email}`,
        meta_json: {
          invitationId,
          email: invitation.email,
          role: invitation.role,
        },
      });

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to cancel invitation' });
    }
  });

  // Get all programs
  fastify.get('/admin/programs', async (_request, _reply) => {
    return await await programRepository.getAllPrograms();
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

    try {
      const program = await await programRepository.getProgramById(programId);
      if (!program) {
        return reply.code(404).send({
          error: 'Program not found',
          error_message: `Program with ID ${programId} does not exist`,
        });
      }

      return program;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch program' });
    }
  });

  // Create program
  fastify.post('/admin/programs', async (request, reply) => {
    const { name, description } = request.body as {
      name: string;
      description: string | null;
    };
    const created_by_user_id = (request as unknown as AuthenticatedRequest).user
      .id;

    // Validate program name
    if (!name || name.trim().length === 0) {
      return reply.code(400).send({
        error: 'Invalid program name',
        error_message: 'Program name cannot be empty',
      });
    }

    try {
      const program = await await programRepository.createProgram({
        name,
        description,
        created_by_user_id,
      });

      // Log admin action
      await adminActionLogRepository.createLog({
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

    return await await programRepository.getProgramAssignments(programId);
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

    const { user_id, role } = request.body as {
      user_id: number;
      role: 'coach' | 'participant';
    };

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
      const user = await await userRepository.getUserById(user_id);
      if (!user) {
        return reply.code(404).send({
          error: 'User not found',
          error_message: `User with ID ${user_id} does not exist`,
        });
      }

      // Verify program exists
      const program = await await programRepository.getProgramById(programId);
      if (!program) {
        return reply.code(404).send({
          error: 'Program not found',
          error_message: `Program with ID ${programId} does not exist`,
        });
      }

      const assignment = await await programRepository.createProgramAssignment({
        program_id: programId,
        user_id,
        role,
      });

      // Log admin action
      try {
        await adminActionLogRepository.createLog({
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
      } catch (logError) {
        fastify.log.error(
          { err: logError },
          'Failed to log admin action for program assignment'
        );
      }

      return assignment;
    } catch (error) {
      fastify.log.error(error);
      return reply
        .code(500)
        .send({ error: 'Failed to create program assignment' });
    }
  });

  // Get knowledge base overview
  fastify.get('/admin/knowledge-base', async (request, _reply) => {
    const { status, search, programId, trainingStatus } = request.query as {
      status?: string;
      search?: string;
      programId?: string;
      trainingStatus?: string;
    };

    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (programId) filters.programId = parseInt(programId, 10);
    if (trainingStatus) filters.trainingStatus = trainingStatus;

    const documents = await knowledgeBaseRepository.getAllDocuments(filters);
    const overview = await knowledgeBaseRepository.getOverview();

    return {
      documents,
      ...overview,
    };
  });

  // Get knowledge base document by ID
  fastify.get('/admin/knowledge-base/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const documentId = Number.parseInt(id, 10);
    if (Number.isNaN(documentId) || documentId <= 0) {
      return reply.code(400).send({
        error: 'Invalid document ID',
        error_message: 'Document ID must be a positive integer',
      });
    }

    const document = await knowledgeBaseRepository.getDocumentById(documentId);
    if (!document) {
      return reply.code(404).send({
        error: 'Document not found',
        error_message: `Document with ID ${documentId} does not exist`,
      });
    }

    return document;
  });

  // Create knowledge base document
  fastify.post('/admin/knowledge-base', async (request, reply) => {
    const { title, type, source, programId, metadata } = request.body as {
      title: string;
      type: string;
      source: string;
      programId?: number;
      metadata?: any;
    };

    // Validate required fields
    if (!title || !type || !source) {
      return reply.code(400).send({
        error: 'Missing required fields',
        error_message: 'title, type, and source are required',
      });
    }

    // Validate type
    const validTypes = ['pdf', 'docx', 'txt', 'url'];
    if (!validTypes.includes(type)) {
      return reply.code(400).send({
        error: 'Invalid type',
        error_message: `Type must be one of: ${validTypes.join(', ')}`,
      });
    }

    try {
      const document = await knowledgeBaseRepository.createDocument({
        title,
        type,
        source,
        programId: programId || null,
        metadata: metadata || null,
      });

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'create_knowledge_base_document',
        entity_type: 'knowledge_base_document',
        entity_id: document.id,
        description: `Created knowledge base document: ${title}`,
        meta_json: { documentId: document.id, title, type, source },
      });

      return document;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to create document',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Update knowledge base document
  fastify.put('/admin/knowledge-base/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, status, trainingStatus, metadata, programId } =
      request.body as {
        title?: string;
        status?: string;
        trainingStatus?: string;
        metadata?: any;
        programId?: number | null;
      };

    const documentId = Number.parseInt(id, 10);
    if (Number.isNaN(documentId) || documentId <= 0) {
      return reply.code(400).send({
        error: 'Invalid document ID',
        error_message: 'Document ID must be a positive integer',
      });
    }

    try {
      // Verify document exists
      const existingDoc =
        await knowledgeBaseRepository.getDocumentById(documentId);
      if (!existingDoc) {
        return reply.code(404).send({
          error: 'Document not found',
          error_message: `Document with ID ${documentId} does not exist`,
        });
      }

      const updates: any = {};
      if (title !== undefined) updates.title = title;
      if (status !== undefined) updates.status = status;
      if (trainingStatus !== undefined) updates.trainingStatus = trainingStatus;
      if (metadata !== undefined) updates.metadata = metadata;
      if (programId !== undefined) updates.programId = programId;

      const document = await knowledgeBaseRepository.updateDocument(
        documentId,
        updates
      );

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'update_knowledge_base_document',
        entity_type: 'knowledge_base_document',
        entity_id: documentId,
        description: `Updated knowledge base document: ${document.title}`,
        meta_json: { documentId, updates },
      });

      return document;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to update document',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Delete knowledge base document
  fastify.delete('/admin/knowledge-base/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const documentId = Number.parseInt(id, 10);
    if (Number.isNaN(documentId) || documentId <= 0) {
      return reply.code(400).send({
        error: 'Invalid document ID',
        error_message: 'Document ID must be a positive integer',
      });
    }

    try {
      // Verify document exists
      const document =
        await knowledgeBaseRepository.getDocumentById(documentId);
      if (!document) {
        return reply.code(404).send({
          error: 'Document not found',
          error_message: `Document with ID ${documentId} does not exist`,
        });
      }

      await knowledgeBaseRepository.deleteDocument(documentId);

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'delete_knowledge_base_document',
        entity_type: 'knowledge_base_document',
        entity_id: documentId,
        description: `Deleted knowledge base document: ${document.title}`,
        meta_json: { documentId, title: document.title },
      });

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to delete document',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Retrain knowledge base document
  fastify.post('/admin/knowledge-base/:id/retrain', async (request, reply) => {
    const { id } = request.params as { id: string };

    const documentId = Number.parseInt(id, 10);
    if (Number.isNaN(documentId) || documentId <= 0) {
      return reply.code(400).send({
        error: 'Invalid document ID',
        error_message: 'Document ID must be a positive integer',
      });
    }

    try {
      // Verify document exists
      const document =
        await knowledgeBaseRepository.getDocumentById(documentId);
      if (!document) {
        return reply.code(404).send({
          error: 'Document not found',
          error_message: `Document with ID ${documentId} does not exist`,
        });
      }

      // Set status to training
      await knowledgeBaseRepository.updateDocument(documentId, {
        trainingStatus: 'training',
      });

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'retrain_knowledge_base_document',
        entity_type: 'knowledge_base_document',
        entity_id: documentId,
        description: `Triggered retraining for document: ${document.title}`,
        meta_json: { documentId, title: document.title },
      });

      // TODO: Trigger actual training job (queue, Azure Functions, etc.)
      // For now, just set to training status

      return { success: true, message: 'Retraining initiated' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to retrain document',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Bulk delete documents
  fastify.post('/admin/knowledge-base/bulk-delete', async (request, reply) => {
    const { ids } = request.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.code(400).send({
        error: 'Invalid request',
        error_message: 'ids must be a non-empty array of document IDs',
      });
    }

    try {
      const deleted: number[] = [];
      const failed: { id: number; reason: string }[] = [];

      for (const id of ids) {
        try {
          const document = await knowledgeBaseRepository.getDocumentById(id);
          if (document) {
            await knowledgeBaseRepository.deleteDocument(id);
            deleted.push(id);
          } else {
            failed.push({ id, reason: 'Document not found' });
          }
        } catch (error) {
          failed.push({
            id,
            reason: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'bulk_delete_knowledge_base_documents',
        entity_type: 'knowledge_base_document',
        entity_id: undefined,
        description: `Bulk deleted ${deleted.length} documents`,
        meta_json: { deleted, failed },
      });

      return { success: true, deleted, failed };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to bulk delete documents',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Bulk retrain documents
  fastify.post('/admin/knowledge-base/bulk-retrain', async (request, reply) => {
    const { ids } = request.body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.code(400).send({
        error: 'Invalid request',
        error_message: 'ids must be a non-empty array of document IDs',
      });
    }

    try {
      const retrained: number[] = [];
      const failed: { id: number; reason: string }[] = [];

      for (const id of ids) {
        try {
          const document = await knowledgeBaseRepository.getDocumentById(id);
          if (document) {
            await knowledgeBaseRepository.updateDocument(id, {
              trainingStatus: 'training',
            });
            retrained.push(id);
          } else {
            failed.push({ id, reason: 'Document not found' });
          }
        } catch (error) {
          failed.push({
            id,
            reason: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Log admin action
      await adminActionLogRepository.createLog({
        user_id: (request as unknown as AuthenticatedRequest).user.id,
        action: 'bulk_retrain_knowledge_base_documents',
        entity_type: 'knowledge_base_document',
        entity_id: undefined,
        description: `Bulk retrained ${retrained.length} documents`,
        meta_json: { retrained, failed },
      });

      // TODO: Trigger actual training jobs for all documents

      return { success: true, retrained, failed };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to bulk retrain documents',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get analytics snapshot
  fastify.get('/admin/analytics', async (request, _reply) => {
    const { range } = request.query as {
      range?: '7d' | '30d' | '90d' | '365d';
    };
    // TODO: Implement analytics repository
    return {
      message: 'Analytics repository implementation pending',
      range: range ?? '30d',
    };
  });
};

export default admin;
