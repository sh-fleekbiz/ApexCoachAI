import React, { useEffect, useState } from 'react';

interface Invitation {
  id: number;
  email: string;
  role: 'admin' | 'coach' | 'user';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
}

const Invitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/invitations');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    try {
      await fetch(`/api/admin/invitations/${invitationId}/cancel`, {
        method: 'POST',
      });
      fetchInvitations();
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Invitations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Created At</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr key={invitation.id}>
                <td className="border px-4 py-2">{invitation.email}</td>
                <td className="border px-4 py-2">{invitation.role}</td>
                <td className="border px-4 py-2">{invitation.status}</td>
                <td className="border px-4 py-2">{new Date(invitation.created_at).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleCancelInvitation(invitation.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Invitations;
