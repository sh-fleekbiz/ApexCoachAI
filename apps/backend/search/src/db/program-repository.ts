import { withClient } from '../lib/db.js';

export interface Program {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  created_by_user_id: number;
}

export interface ProgramAssignment {
  id: number;
  program_id: number;
  user_id: number;
  role: 'coach' | 'participant';
  created_at: string;
}

export const programRepository = {
  async createProgram(
    program: Omit<Program, 'id' | 'created_at'>
  ): Promise<Program> {
    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO programs (name, description, created_by_user_id) VALUES ($1, $2, $3) RETURNING *',
        [program.name, program.description, program.created_by_user_id]
      );
      return result.rows[0] as Program;
    });
  },

  async getProgramById(id: number): Promise<Program | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM programs WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? (result.rows[0] as Program) : undefined;
    });
  },

  async getAllPrograms(): Promise<Program[]> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM programs');
      return result.rows as Program[];
    });
  },

  async createProgramAssignment(
    assignment: Omit<ProgramAssignment, 'id' | 'created_at'>
  ): Promise<ProgramAssignment> {
    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO program_assignments (program_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
        [assignment.program_id, assignment.user_id, assignment.role]
      );
      return result.rows[0] as ProgramAssignment;
    });
  },

  async getProgramAssignmentById(
    id: number
  ): Promise<ProgramAssignment | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM program_assignments WHERE id = $1',
        [id]
      );
      return result.rows.length > 0
        ? (result.rows[0] as ProgramAssignment)
        : undefined;
    });
  },

  async getProgramAssignments(programId: number): Promise<ProgramAssignment[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM program_assignments WHERE program_id = $1',
        [programId]
      );
      return result.rows as ProgramAssignment[];
    });
  },

  async getUserProgramAssignments(
    userId: number
  ): Promise<ProgramAssignment[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM program_assignments WHERE user_id = $1',
        [userId]
      );
      return result.rows as ProgramAssignment[];
    });
  },

  async getUserProgramIds(userId: number): Promise<number[]> {
    const assignments = await this.getUserProgramAssignments(userId);
    return assignments.map((a) => a.program_id);
  },
};
