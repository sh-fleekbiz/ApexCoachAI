import type { PrismaClient, Program, ProgramAssignment, AssignmentRole } from '@prisma/client';

export const createProgramRepository = (prisma: PrismaClient) => ({
  async createProgram(
    program: {
      name: string;
      description: string | null;
      created_by_user_id: number;
    }
  ): Promise<Program> {
    return prisma.program.create({
      data: {
        name: program.name,
        description: program.description,
        createdByUserId: program.created_by_user_id,
      },
    });
  },

  async getProgramById(id: number): Promise<Program | null> {
    return prisma.program.findUnique({
      where: { id },
    });
  },

  async getAllPrograms(): Promise<Program[]> {
    return prisma.program.findMany();
  },

  async createProgramAssignment(
    assignment: {
      program_id: number;
      user_id: number;
      role: AssignmentRole;
    }
  ): Promise<ProgramAssignment> {
    return prisma.programAssignment.create({
      data: {
        programId: assignment.program_id,
        userId: assignment.user_id,
        role: assignment.role,
      },
    });
  },

  async getProgramAssignmentById(
    id: number
  ): Promise<ProgramAssignment | null> {
    return prisma.programAssignment.findUnique({
      where: { id },
    });
  },

  async getProgramAssignments(programId: number): Promise<ProgramAssignment[]> {
    return prisma.programAssignment.findMany({
      where: { programId },
    });
  },

  async getUserProgramAssignments(
    userId: number
  ): Promise<ProgramAssignment[]> {
    return prisma.programAssignment.findMany({
      where: { userId },
    });
  },

  async getUserProgramIds(userId: number): Promise<number[]> {
    const assignments = await this.getUserProgramAssignments(userId);
    return assignments.map((a) => a.programId);
  },
});
