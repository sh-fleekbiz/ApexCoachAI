import { database } from './database.js';

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
  createProgram(program: Omit<Program, 'id' | 'created_at'>): Program {
    const stmt = database.prepare(
      'INSERT INTO programs (name, description, created_by_user_id) VALUES (?, ?, ?)',
    );
    const result = stmt.run(program.name, program.description, program.created_by_user_id);
    return this.getProgramById(result.lastInsertRowid as number)!;
  },

  getProgramById(id: number): Program | undefined {
    return database.prepare('SELECT * FROM programs WHERE id = ?').get(id) as Program | undefined;
  },

  getAllPrograms(): Program[] {
    return database.prepare('SELECT * FROM programs').all() as Program[];
  },

  createProgramAssignment(assignment: Omit<ProgramAssignment, 'id' | 'created_at'>): ProgramAssignment {
    const stmt = database.prepare(
      'INSERT INTO program_assignments (program_id, user_id, role) VALUES (?, ?, ?)',
    );
    const result = stmt.run(assignment.program_id, assignment.user_id, assignment.role);
    return this.getProgramAssignmentById(result.lastInsertRowid as number)!;
  },

  getProgramAssignmentById(id: number): ProgramAssignment | undefined {
    return database.prepare('SELECT * FROM program_assignments WHERE id = ?').get(id) as ProgramAssignment | undefined;
  },

  getProgramAssignments(programId: number): ProgramAssignment[] {
    return database.prepare('SELECT * FROM program_assignments WHERE program_id = ?').all(programId) as ProgramAssignment[];
  },
};
