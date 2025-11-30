import type { PrismaClient, Invitation, Role, InvitationStatus } from '@prisma/client';

export const createInvitationRepository = (prisma: PrismaClient) => ({
  async createInvitation(
    invitation: {
      email: string;
      role: Role;
      invited_by_user_id: number;
    }
  ): Promise<Invitation> {
    return prisma.invitation.create({
      data: {
        email: invitation.email,
        role: invitation.role,
        invitedByUserId: invitation.invited_by_user_id,
      },
    });
  },

  async getInvitationById(id: number): Promise<Invitation | null> {
    return prisma.invitation.findUnique({
      where: { id },
    });
  },

  async getAllInvitations(): Promise<Invitation[]> {
    return prisma.invitation.findMany();
  },

  async updateInvitationStatus(
    id: number,
    status: InvitationStatus
  ): Promise<void> {
    await prisma.invitation.update({
      where: { id },
      data: { status },
    });
  },
});
