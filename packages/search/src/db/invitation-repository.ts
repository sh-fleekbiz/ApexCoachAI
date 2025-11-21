import { database } from './database.js';

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
  createInvitation(invitation: Omit<Invitation, 'id' | 'status' | 'created_at' | 'accepted_at'>): Invitation {
    const stmt = database.prepare('INSERT INTO invitations (email, role, invited_by_user_id) VALUES (?, ?, ?)');
    const result = stmt.run(invitation.email, invitation.role, invitation.invited_by_user_id);
    return this.getInvitationById(result.lastInsertRowid as number)!;
  },

  getInvitationById(id: number): Invitation | undefined {
    return database.prepare('SELECT * FROM invitations WHERE id = ?').get(id) as Invitation | undefined;
  },

  getAllInvitations(): Invitation[] {
    return database.prepare('SELECT * FROM invitations').all() as Invitation[];
  },

  updateInvitationStatus(id: number, status: Invitation['status']) {
    const stmt = database.prepare('UPDATE invitations SET status = ? WHERE id = ?');
    stmt.run(status, id);
  },
};
