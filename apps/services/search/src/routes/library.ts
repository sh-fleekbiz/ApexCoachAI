import { type FastifyPluginAsync } from 'fastify';

interface LibraryFilters {
  status?: string;
  search?: string;
  programId?: string;
}

const library: FastifyPluginAsync = async (
  fastify,
  _options
): Promise<void> => {
  // Get all library resources with optional filters
  fastify.get('/library', async (request, reply) => {
    const { status, search, programId } = request.query as LibraryFilters;

    try {
      const where: any = {};
      
      // Add status filter
      if (status && status !== 'all') {
        where.status = status;
      }

      // Add search filter (search in title and source)
      if (search && search.trim()) {
        where.OR = [
          { title: { contains: search.trim(), mode: 'insensitive' } },
          { source: { contains: search.trim(), mode: 'insensitive' } },
        ];
      }

      // Add program filter
      if (programId) {
        const programIdNum = Number.parseInt(programId, 10);
        if (!Number.isNaN(programIdNum)) {
          where.programId = programIdNum;
        }
      }

      const result = await fastify.prisma.libraryResource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return {
        resources: result.map((row) => ({
          id: row.id,
          programId: row.programId,
          title: row.title,
          description: null, // Not in schema, but keeping for future
          type: row.type,
          source: row.source,
          thumbnailUrl: row.thumbnailUrl,
          status: row.status,
          transcriptJson: row.transcriptJson,
          durationSeconds: row.durationSeconds,
          speakerMetaJson: row.speakerMetaJson,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        })),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to fetch library resources',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get a single library resource by ID
  fastify.get('/library/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const resourceId = Number.parseInt(id, 10);
    if (Number.isNaN(resourceId) || resourceId <= 0) {
      return reply.code(400).send({
        error: 'Invalid resource ID',
        error_message: 'Resource ID must be a positive integer',
      });
    }

    try {
      const row = await fastify.prisma.libraryResource.findUnique({
        where: { id: resourceId },
      });

      if (!row) {
        return reply.code(404).send({
          error: 'Resource not found',
          error_message: `Resource with ID ${resourceId} does not exist`,
        });
      }

      return {
        id: row.id,
        programId: row.programId,
        title: row.title,
        description: null,
        type: row.type,
        source: row.source,
        thumbnailUrl: row.thumbnailUrl,
        status: row.status,
        transcriptJson: row.transcriptJson,
        durationSeconds: row.durationSeconds,
        speakerMetaJson: row.speakerMetaJson,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to fetch resource',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Create a new library resource (admin only)
  fastify.post('/admin/library', async (request, reply) => {
    // Require admin role
    const user = (request as any).user;
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return reply.code(403).send({
        error: 'Forbidden',
        error_message: 'Only admins can create library resources',
      });
    }

    const { title, type, source, thumbnailUrl, programId } = request.body as {
      title: string;
      type: string;
      source: string;
      thumbnailUrl?: string | null;
      programId?: number | null;
    };

    // Validate required fields
    if (!title || !title.trim()) {
      return reply.code(400).send({
        error: 'Invalid title',
        error_message: 'Title is required',
      });
    }

    if (!type || !type.trim()) {
      return reply.code(400).send({
        error: 'Invalid type',
        error_message: 'Type is required',
      });
    }

    if (!source || !source.trim()) {
      return reply.code(400).send({
        error: 'Invalid source',
        error_message: 'Source URL is required',
      });
    }

    // Validate type
    const validTypes = ['video', 'audio', 'document'];
    if (!validTypes.includes(type)) {
      return reply.code(400).send({
        error: 'Invalid type',
        error_message: `Type must be one of: ${validTypes.join(', ')}`,
      });
    }

    try {
      const row = await fastify.prisma.libraryResource.create({
        data: {
          title: title.trim(),
          type,
          source: source.trim(),
          thumbnailUrl: thumbnailUrl || null,
          programId: programId || null,
          status: 'pending',
        },
      });

      return {
        id: row.id,
        programId: row.programId,
        title: row.title,
        description: null,
        type: row.type,
        source: row.source,
        thumbnailUrl: row.thumbnailUrl,
        status: row.status,
        transcriptJson: row.transcriptJson,
        durationSeconds: row.durationSeconds,
        speakerMetaJson: row.speakerMetaJson,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to create resource',
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  });
};

export default library;
