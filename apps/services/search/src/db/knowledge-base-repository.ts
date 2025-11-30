import type { PrismaClient, KnowledgeBaseDocument } from '@prisma/client';

interface KnowledgeBaseFilters {
  status?: string;
  search?: string;
  programId?: number;
  trainingStatus?: string;
}

export const createKnowledgeBaseRepository = (prisma: PrismaClient) => ({
  async getAllDocuments(
    filters?: KnowledgeBaseFilters
  ): Promise<(KnowledgeBaseDocument & { program_name?: string })[]> {
    const where: any = {};
    
    if (filters?.trainingStatus) {
      where.trainingStatus = filters.trainingStatus;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.programId) {
      where.programId = filters.programId;
    }
    if (filters?.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const documents = await prisma.knowledgeBaseDocument.findMany({
      where,
      include: {
        program: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => ({
      ...doc,
      program_name: doc.program?.name,
    })) as (KnowledgeBaseDocument & { program_name?: string })[];
  },

  async getDocumentById(id: number): Promise<(KnowledgeBaseDocument & { program_name?: string }) | null> {
    const doc = await prisma.knowledgeBaseDocument.findUnique({
      where: { id },
      include: {
        program: {
          select: { name: true },
        },
      },
    });

    if (!doc) return null;

    return {
      ...doc,
      program_name: doc.program?.name,
    } as KnowledgeBaseDocument & { program_name?: string };
  },

  async createDocument(data: {
    title: string;
    type: string;
    source: string;
    programId?: number | null;
    metadata?: any;
  }): Promise<KnowledgeBaseDocument> {
    return prisma.knowledgeBaseDocument.create({
      data: {
        title: data.title,
        type: data.type,
        source: data.source,
        programId: data.programId ?? null,
        metadata: data.metadata ?? null,
        status: 'pending',
        trainingStatus: 'not_trained',
      },
    });
  },

  async updateDocument(
    id: number,
    data: Partial<{
      title: string;
      status: string;
      trainingStatus: string;
      metadata: any;
      programId: number | null;
    }>
  ): Promise<KnowledgeBaseDocument> {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.trainingStatus !== undefined) updateData.trainingStatus = data.trainingStatus;
    if (data.metadata !== undefined) updateData.metadata = data.metadata;
    if (data.programId !== undefined) updateData.programId = data.programId;

    return prisma.knowledgeBaseDocument.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteDocument(id: number): Promise<void> {
    await prisma.knowledgeBaseDocument.delete({
      where: { id },
    });
  },

  async getOverview() {
    const [
      totalDocuments,
      trainedDocuments,
      trainingDocuments,
      notTrainedDocuments,
      failedDocuments,
      totalResources,
    ] = await Promise.all([
      prisma.knowledgeBaseDocument.count(),
      prisma.knowledgeBaseDocument.count({ where: { trainingStatus: 'trained' } }),
      prisma.knowledgeBaseDocument.count({ where: { trainingStatus: 'training' } }),
      prisma.knowledgeBaseDocument.count({ where: { trainingStatus: 'not_trained' } }),
      prisma.knowledgeBaseDocument.count({ where: { trainingStatus: 'failed' } }),
      prisma.libraryResource.count(),
    ]);

    return {
      totalDocuments,
      trainedDocuments,
      trainingDocuments,
      notTrainedDocuments,
      failedDocuments,
      totalResources,
    };
  },
});
