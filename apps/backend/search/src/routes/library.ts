import { type FastifyPluginAsync } from 'fastify';
import { withClient } from '../lib/db.js';

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
      const result = await withClient(async (client) => {
        let query = 'SELECT * FROM library_resources WHERE 1=1';
        const queryParams: (string | number)[] = [];
        let paramIndex = 1;

        // Add status filter
        if (status && status !== 'all') {
          query += ` AND status = $${paramIndex}`;
          queryParams.push(status);
          paramIndex++;
        }

        // Add search filter (search in title and description)
        if (search && search.trim()) {
          query += ` AND (title ILIKE $${paramIndex} OR source ILIKE $${paramIndex})`;
          queryParams.push(`%${search.trim()}%`);
          paramIndex++;
        }

        // Add program filter
        if (programId) {
          const programIdNum = Number.parseInt(programId, 10);
          if (!Number.isNaN(programIdNum)) {
            query += ` AND program_id = $${paramIndex}`;
            queryParams.push(programIdNum);
            paramIndex++;
          }
        }

        query += ' ORDER BY created_at DESC';

        return await client.query(query, queryParams);
      });

      return {
        resources: result.rows.map((row) => ({
          id: row.id,
          programId: row.program_id,
          title: row.title,
          description: null, // Not in schema, but keeping for future
          type: row.type,
          source: row.source,
          thumbnailUrl: row.thumbnail_url,
          status: row.status,
          transcriptJson: row.transcript_json,
          durationSeconds: row.duration_seconds,
          speakerMetaJson: row.speaker_meta_json,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
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
      const result = await withClient(async (client) => {
        return await client.query(
          'SELECT * FROM library_resources WHERE id = $1',
          [resourceId]
        );
      });

      if (result.rows.length === 0) {
        return reply.code(404).send({
          error: 'Resource not found',
          error_message: `Resource with ID ${resourceId} does not exist`,
        });
      }

      const row = result.rows[0];
      return {
        id: row.id,
        programId: row.program_id,
        title: row.title,
        description: null,
        type: row.type,
        source: row.source,
        thumbnailUrl: row.thumbnail_url,
        status: row.status,
        transcriptJson: row.transcript_json,
        durationSeconds: row.duration_seconds,
        speakerMetaJson: row.speaker_meta_json,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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
      const result = await withClient(async (client) => {
        return await client.query(
          `INSERT INTO library_resources
           (title, type, source, thumbnail_url, program_id, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
           RETURNING *`,
          [
            title.trim(),
            type,
            source.trim(),
            thumbnailUrl || null,
            programId || null,
          ]
        );
      });

      const row = result.rows[0];
      return {
        id: row.id,
        programId: row.program_id,
        title: row.title,
        description: null,
        type: row.type,
        source: row.source,
        thumbnailUrl: row.thumbnail_url,
        status: row.status,
        transcriptJson: row.transcript_json,
        durationSeconds: row.duration_seconds,
        speakerMetaJson: row.speaker_meta_json,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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
