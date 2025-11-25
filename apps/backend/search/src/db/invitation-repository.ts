import { withClient } from '../lib/db.js';

export interface Invitation {
  id: number;
  email: string;
  role: 'admin' | 'coach' | 'user';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invited_by_user_id: number;
  created_at: string;
  accepted_at: string | null;
}

export const invitationRepository = {
  async createInvitation(
    invitation: Omit<Invitation, 'id' | 'status' | 'created_at' | 'accepted_at'>
  ): Promise<Invitation> {
    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO invitations (email, role, invited_by_user_id) VALUES ($1, $2, $3) RETURNING *',
        [invitation.email, invitation.role, invitation.invited_by_user_id]
      );
      return result.rows[0] as Invitation;
    });
  },

  async getInvitationById(id: number): Promise<Invitation | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM invitations WHERE id = $1',
        [id]
      );
      return result.rows.length > 0
        ? (result.rows[0] as Invitation)
        : undefined;
    });
  },

  async getAllInvitations(): Promise<Invitation[]> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM invitations');
      return result.rows as Invitation[];
    });
  },

  async updateInvitationStatus(
    id: number,
    status: Invitation['status']
  ): Promise<void> {
    return withClient(async (client) => {
      await client.query('UPDATE invitations SET status = $1 WHERE id = $2', [
        status,
        id,
      ]);
    });
  },
};
